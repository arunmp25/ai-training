"""Topic 13: the tool loop. Parallel calls, an error, and a retry.
Run:  pip install anthropic
      export ANTHROPIC_API_KEY=...
      python tool_loop.py
"""
import json
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"

TOOLS = [{
    "name": "get_claim_status",
    "description": "Current status of one insurance claim. Read-only. "
                   "If it fails with 'busy', it is safe to retry.",
    "input_schema": {"type": "object",
                     "properties": {"claim_id": {"type": "string"}},
                     "required": ["claim_id"]},
}]

attempts = {}
def get_claim_status(claim_id):
    # Demo stub: CLM-302 is busy the first time it is asked for.
    attempts[claim_id] = attempts.get(claim_id, 0) + 1
    if claim_id == "CLM-302" and attempts[claim_id] == 1:
        raise RuntimeError("Claims system busy (503). Safe to retry in a few seconds.")
    status = {"CLM-301": "Approved, paid 2 Nov",
              "CLM-302": "Awaiting assessor"}.get(claim_id, "Not found")
    return {"claim_id": claim_id, "status": status}

HANDLERS = {"get_claim_status": get_claim_status}

def run_tool(name, args):
    """Run one tool. Errors go back to the model as text, never as a crash."""
    try:
        return json.dumps(HANDLERS[name](**args)), False
    except Exception as err:
        return str(err), True

messages = [{"role": "user", "content": "Where are my claims CLM-301 and CLM-302?"}]

for turn in range(10):  # a hard stop, so a confused loop cannot run forever
    response = client.messages.create(
        model=MODEL, max_tokens=800, tools=TOOLS, messages=messages)
    messages.append({"role": "assistant", "content": response.content})
    if response.stop_reason != "tool_use":
        break  # end_turn: the model has its answer

    # One reply can hold several tool_use blocks. Answer every one of them.
    results = []
    for block in response.content:
        if block.type == "tool_use":
            output, failed = run_tool(block.name, block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id,
                            "content": output, "is_error": failed})
    messages.append({"role": "user", "content": results})

print(response.content[-1].text)
