"""Topic 15: the same agent, built as a LangGraph graph.
Run:  pip install langgraph langchain-anthropic
      export ANTHROPIC_API_KEY=...
      python langgraph_agent.py
"""
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, START
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import InMemorySaver


@tool
def get_motor_quote(policy_id: str, add_driver_age: int) -> dict:
    """Live annual premium from the rating engine if a driver is added."""
    return {"current_annual": 18400, "new_annual": 44750, "currency": "INR"}


tools = [get_motor_quote]
llm = ChatAnthropic(model="claude-sonnet-5-5").bind_tools(tools)


def agent(state: MessagesState):
    """Node: call the model with the conversation so far."""
    return {"messages": [llm.invoke(state["messages"])]}


graph = StateGraph(MessagesState)
graph.add_node("agent", agent)
graph.add_node("tools", ToolNode(tools))
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tools_condition)  # tool call? go to "tools", else END
graph.add_edge("tools", "agent")                       # results go back to the model
app = graph.compile(checkpointer=InMemorySaver())      # saves state after every step

config = {"configurable": {"thread_id": "MTR-55120"}}
result = app.invoke(
    {"messages": [{"role": "user", "content": "Policy MTR-55120: what if I add my son, 18?"}]},
    config,
)
print(result["messages"][-1].content)
