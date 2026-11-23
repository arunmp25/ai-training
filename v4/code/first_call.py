"""Topic 2: one request to the model, with every part of the prompt.
Run:  pip install anthropic
      export ANTHROPIC_API_KEY=...
      python first_call.py
"""
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY

response = client.messages.create(
    # Settings: which model, how long, how creative
    model="claude-sonnet-5-5",
    max_tokens=1024,
    temperature=0.3,
    # System prompt: written by the app developer, not the user
    system=(
        "You are HarborShield's customer email assistant. "
        "Write in plain British English, under 120 words. "
        "Never invent policy details: ask if something is missing."
    ),
    # Messages: the conversation so far, oldest first
    messages=[
        {"role": "user",
         "content": "Write a renewal reminder for motor policy MTR-55120."},
        {"role": "assistant",
         "content": "Happy to. When does it renew, and what is the new premium?"},
        {"role": "user",
         "content": "Renews 1 December at ₹18,400. Sign it 'HarborShield Renewals'."},
    ],
)

# The reply is a list of content blocks; here there is one text block
print(response.content[0].text)
print("stop_reason:", response.stop_reason)
print("tokens in/out:", response.usage.input_tokens, response.usage.output_tokens)
