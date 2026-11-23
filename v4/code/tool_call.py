"""Topic 11: one tool call, start to finish.
Run:  pip install anthropic
      export ANTHROPIC_API_KEY=...
      python tool_call.py
"""
import json
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
SYSTEM = "You are HarborShield's Quote Assistant. Never estimate prices: use get_motor_quote."

# 1. Describe the tool. The model only ever sees this description.
TOOLS = [{
    "name": "get_motor_quote",
    "description": "Get a live annual motor premium from HarborShield's rating engine. "
                   "Use for ANY question about price. Read-only.",
    "input_schema": {
        "type": "object",
        "properties": {
            "policy_id": {"type": "string", "description": "Format MTR-12345"},
            "add_driver": {"type": "object", "properties": {
                "age": {"type": "integer"}, "licence_years": {"type": "integer"}}},
        },
        "required": ["policy_id"],
    },
}]

# 2. Your code: the real system behind the tool (a stub for the demo).
def get_motor_quote(policy_id, add_driver=None):
    new_annual = 44750 if add_driver else 18400
    return {"current_annual": 18400, "new_annual": new_annual, "currency": "INR"}

messages = [{"role": "user",
             "content": "Policy MTR-55120. What will my premium be if I add my son, 18?"}]

# 3. Request 1: the question plus the tool list.
response = client.messages.create(
    model=MODEL, max_tokens=800, system=SYSTEM, tools=TOOLS, messages=messages)

# 4. The model asks for the tool. It does not run anything itself.
if response.stop_reason == "tool_use":
    call = next(b for b in response.content if b.type == "tool_use")

    # 5. Your code checks it, then runs it.
    assert call.name == "get_motor_quote"
    result = get_motor_quote(**call.input)

    # 6. Request 2: the whole conversation again, plus the result.
    messages.append({"role": "assistant", "content": response.content})
    messages.append({"role": "user", "content": [{
        "type": "tool_result",
        "tool_use_id": call.id,
        "content": json.dumps(result),
    }]})
    response = client.messages.create(
        model=MODEL, max_tokens=800, system=SYSTEM, tools=TOOLS, messages=messages)

# 7. The final answer, in plain English.
print(response.content[-1].text)
