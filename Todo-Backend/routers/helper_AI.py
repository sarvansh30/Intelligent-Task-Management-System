import asyncio
from dotenv import load_dotenv
import os
import json
from mistralai import Mistral
from datetime import datetime
load_dotenv()

api_key = os.environ["API_KEY"]
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

def PriorityTask(tasks):
    messages=[{
    "role": "user",
    "content": (
        "Assign priorities to these tasks based on deadline (closest first) and type of task like health>wordk>academics>household work ,reason with the priority as how important you thnk the task is based on the context of all the tasks combined. Highest priority then give highest number lowest priority give 0"
        "Return a JSON object with a 'tasks' array containing each task with _id and priority only. "
        f"Tasks: {json.dumps(tasks)}"
    )
    }]
    response = client.chat.complete(
        model=model,
        messages=messages,
        response_format={"type":"json_object"}
    )
    prioritized_tasks = json.loads(response.choices[0].message.content)

    return prioritized_tasks


async def PlanMyDay(tasks):
    response = await client.chat.stream_async(
        model=model,
        messages=[
            {
                "role": "user",
                "content": (
                    "Below are my lists of tasks. Can you help me plan out my day so I can be productive with proper breaks? "
                    "Please provide the plan in markdown format, ensuring the following:\n"
                    "- Use headings with '## ' followed by a space (e.g., '## Morning Plan').\n"
                    "- Use list items with '- ' followed by a space (e.g., '- 9:00 AM: Task 1').\n"
                    "- Separate paragraphs and sections with double newlines.\n\n"
                    "For example:\n\n"
                    "## Morning Plan\n\n"
                    "- 9:00 AM: Task 1\n"
                    "- 10:00 AM: Task 2\n\n"
                    "## Afternoon Plan\n\n"
                    "- 1:00 PM: Task 3\n"
                    "- 2:00 PM: Break\n\n"
                    "Please follow this formatting in your response.\n\n"
                    f"Tasks: {json.dumps(tasks)}"
                ),
            },
        ],
    )
    async for chunk in response:
        if chunk.data.choices[0].delta.content is not None:
            yield chunk.data.choices[0].delta.content

async def getTaskHelp(task):
    response = await client.chat.stream_async(
        model=model,
        messages=[
            {
                "role": "user",
                "content": (
                    "Below is a task I want to perform. Can you give me directions in points on how to do that, along with resources I should check out to successfully complete the task? "
                    "Please provide the response in markdown format, ensuring the following:\n"
                    "- Use headings with '## ' followed by a space (e.g., '## Steps to Complete Task').\n"
                    "- Use list items with '- ' followed by a space (e.g., '- Step 1: Description').\n"
                    "- Separate sections with double newlines.\n\n"
                    "For example:\n\n"
                    "## Steps to Complete Task\n\n"
                    "- Step 1: Description\n"
                    "- Step 2: Description\n\n"
                    "## Resources\n\n"
                    "- Resource 1\n"
                    "- Resource 2\n\n"
                    "Please follow this formatting in your response.\n\n"
                    f"Task: {json.dumps(task)}"
                ),
            },
        ],
    )
    async for chunk in response:
        if chunk.data.choices[0].delta.content is not None:
            yield chunk.data.choices[0].delta.content
