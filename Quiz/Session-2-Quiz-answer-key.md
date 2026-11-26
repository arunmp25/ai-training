# AI Training: Session 2 Quiz (answer key)

Do not share this file with participants. Share the Microsoft Forms link instead.

**1. (Topic 9) What does RAG (retrieval-augmented generation) do before the model answers a question?**  
A. Retrains the model on your documents  
B. Looks up the relevant parts of your documents and adds them to the prompt  ✅  
C. Searches the public internet  
D. Raises the temperature so the answer is more creative  
*Why:* RAG is an open-book exam for AI: retrieve the relevant chunks and put them on the desk. The model itself does not change.

**2. (Topic 9) Before documents can be used for RAG, they are cut into smaller pieces. What are these pieces called?**  
A. Chunks  ✅  
B. Prompts  
C. Tool calls  
D. Agents  
*Why:* Documents are split into chunks. How you cut them decides the answer: keep whole thoughts together, with a little overlap.

**3. (Topic 9) Which instruction in a RAG prompt best stops the assistant inventing answers the documents do not contain?**  
A. “Answer as fast as you can.”  
B. “Be creative.”  
C. “Never say you don't know.”  
D. “Use only these sources, cite them, and say if the answer is not there.”  ✅  
*Why:* Telling the model to stay within the sources, cite them and admit gaps turns retrieval into answers people can trust.

**4. (Topic 9) When is it better to simply paste a document into the prompt instead of using RAG?**  
A. When the documents change every day  
B. When you have thousands of documents  
C. When it is a one-off document that fits in the context window  ✅  
D. Never: always use RAG  
*Why:* Rule of thumb: RAG for knowledge that changes, fine-tuning for behaviour, and just paste it in for a one-off document that fits.

**5. (Topic 10) What is an embedding?**  
A. A list of numbers that captures the meaning of a piece of text  ✅  
B. A picture inserted into a document  
C. A password that unlocks the AI  
D. A summary written by the model  
*Why:* An embedding turns text into numbers that capture its meaning, so a computer can find things by what they mean, not the words they use.

**6. (Topic 10) Why can search by meaning (embeddings) find text that keyword search misses?**  
A. It reads the documents faster  
B. It compares meaning, so it finds matches even when no words are shared  ✅  
C. It searches the internet as well  
D. It ignores the question and returns everything  
*Why:* Keyword search only finds the words you typed. Meaning search compares embeddings, so different words with the same meaning still match.

**7. (Topic 10) In a RAG system, where does most of the running cost come from?**  
A. Embedding the document library once  
B. Choosing the chunk size  
C. The model reading the retrieved chunks and writing an answer, for every question  ✅  
D. They all cost exactly the same  
*Why:* Embedding is cheap and mostly a one-off. The model reading and writing on every question is the cost to watch, which is why top-k stays small.

**8. (Topic 10) Your documents were embedded with embedding model X. Which model must you use to embed the users' questions?**  
A. Any embedding model  
B. The largest model available  
C. No model: questions do not need embedding  
D. The same model X  ✅  
*Why:* Vectors from different models cannot be compared. Switching model means re-embedding every document.

**9. (Topic 11) What does a vector database store for each chunk?**  
A. Only the vector  
B. Only the file name  
C. The vector, the original text and metadata such as source, date and who may see it  ✅  
D. A screenshot of the page  
*Why:* Each record holds the vector (for search), the text (for the model to read) and metadata (for citations, freshness and permissions).

**10. (Topic 11) In a RAG system, users must only see documents they are allowed to see. Where should this be enforced?**  
A. In the prompt, by asking the model not to reveal them  
B. Raise top-k so more results come back  
C. Use bigger chunks  
D. Add permission filters to the database search, so chunks the user may not see never reach the model  ✅  
*Why:* Filters run inside the database query. Never rely on the prompt to hide things the user is not allowed to see.

**11. (Topic 11) Which technique runs keyword search and meaning search together, so exact codes and names are found as well as similar meanings?**  
A. Hybrid search  ✅  
B. Re-ranking  
C. Chunking  
D. Fine-tuning  
*Why:* Meaning search finds “similar”, but similar codes are not the same thing. Keyword search catches exact matches, so hybrid runs both and merges the results.

**12. (Topic 11) Your team is building its first RAG assistant. What is the best advice?**  
A. Start with the most advanced pattern, such as GraphRAG  
B. Start with basic RAG plus permission filters, and add a pattern only when you see a specific problem  ✅  
C. Skip permission filters until later  
D. Use as many patterns as possible from day one  
*Why:* Every pattern adds cost, delay and things to look after. Start simple, measure, and climb one rung at a time.

**13. (Topic 12) When an AI assistant uses a tool, who actually runs the tool?**  
A. Your app (the software around the model); the model only asks for it  ✅  
B. The model runs it inside itself  
C. The customer  
D. The tool runs itself whenever it likes  
*Why:* The model writes a structured tool request. Your software decides whether to run it, runs it and sends the result back.

**14. (Topic 12) How does the model know which tools exist and when to use them?**  
A. It guesses  
B. It learnt every company's tools during training  
C. It searches the internet for them  
D. From each tool's name and description, sent with every request  ✅  
*Why:* The model only knows a tool by its description. Tool descriptions are prompts too: be clear about what the tool does and when to use it.

**15. (Topic 12) Which kind of tool most needs a person to approve it before it runs?**  
A. A tool that only reads information  
B. A tool that searches documents  
C. A tool that takes an action that cannot be undone  ✅  
D. A tool that does a calculation  
*Why:* Read-only tools can run freely, reversible changes should be logged, and irreversible actions need a human to approve.

**16. (Topic 13) Every tool definition has three parts. Which three?**  
A. A name, a description and an input schema  ✅  
B. A colour, a size and a price  
C. A username, a password and a URL  
D. A temperature, a token limit and a model  
*Why:* The name, description and input schema (JSON Schema) are sent with every request, so they cost tokens and are read like a prompt.

**17. (Topic 13) A tool call fails because the model sent invalid input. What should the app do?**  
A. Crash and show an error page  
B. Hide the error and tell the user it worked  
C. Send a clear error message back to the model, so it can fix the input or ask the user  ✅  
D. Start a new chat  
*Why:* When a tool fails, the error message is a prompt. A clear error lets the model correct itself or ask the user for what it needs.

**18. (Topic 14) What is MCP (Model Context Protocol)?**  
A. A new AI model  
B. An open standard for connecting AI apps to tools and data: build a connector once, use it in any compatible app  ✅  
C. A way to make the model run faster  
D. A replacement for all of your company's APIs  
*Why:* MCP is like USB-C for AI: one standard plug. It wraps your existing APIs rather than replacing them.

**19. (Topic 14) In MCP, what do we call the AI app, and what do we call the connector to a company system?**  
A. The app is the server; the connector is the host  
B. The app is the host; the connector is the server  ✅  
C. The app is the model; the connector is the database  
D. Both are called clients  
*Why:* The host is the AI app and the server is the connector to a system. The client is plumbing inside the app.

**20. (Topic 14) What should you keep in mind before connecting a new MCP server?**  
A. MCP servers are always safe because they follow a standard  
B. Give it full admin access so it never fails  
C. It does not matter: the model checks every server for you  
D. An MCP server is code you are trusting: use only servers you trust, with the least access they need  ✅  
*Why:* A malicious server can hide instructions in its tool descriptions (tool poisoning). Trust carefully and limit access.
