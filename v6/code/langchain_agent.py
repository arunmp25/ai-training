"""Topic 19: an agent with LangChain.
Run:  pip install langchain langchain-anthropic
      export ANTHROPIC_API_KEY=...
      python langchain_agent.py
"""
from langchain.agents import create_agent
from langchain.tools import tool


@tool
def get_policy(policy_id: str) -> dict:
    """Look up a motor policy: drivers, cover and current annual premium."""
    return {"policy_id": policy_id, "cover": "comprehensive",
            "drivers": [{"age": 47}], "annual_premium": 18400}


@tool
def get_motor_quote(policy_id: str, add_driver_age: int) -> dict:
    """Live annual premium from the rating engine if a driver is added."""
    return {"current_annual": 18400, "new_annual": 44750, "currency": "INR"}


agent = create_agent(
    model="anthropic:claude-sonnet-5-5",
    tools=[get_policy, get_motor_quote],
    system_prompt="You are HarborShield's quote assistant. "
                  "Never estimate prices: always use the tools.",
)

result = agent.invoke({"messages": [
    {"role": "user", "content": "Policy MTR-55120: what if I add my son, 18?"}
]})

for message in result["messages"]:
    message.pretty_print()  # every step the agent took, in order
