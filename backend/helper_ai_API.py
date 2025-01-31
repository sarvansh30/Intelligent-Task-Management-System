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
    response =client.chat.complete(
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
                  "content": ("Below are my lists of tasks can you help me plan out my day so i can be productive with proper breaks"
                              f"Tasks: {json.dumps(tasks)}"),
              },
        ],
    )
    async for chunk in response:
        if chunk.data.choices[0].delta.content is not None:
            print(chunk.data.choices[0].delta.content, end="")

tasks=[{'_id': '6798ada91c3da6cb5d45e670', 'title': 'prepare for qualys interview', 'iscompleted': True, 'deadline': '2025-01-28T00:00:00', 'priority': 4}, {'_id': '6798af5b552f60e8271e3395', 'title': 'buy a file and print resume', 'iscompleted': True, 'deadline': '2025-01-28T00:00:00', 'priority': 3}, {'_id': '679cc536875294e53ba5ae28', 'title': 'Add more features using AI', 'iscompleted': False, 'deadline': '2025-02-01T00:00:00', 'priority': 2}, {'_id': '679cc552875294e53ba5ae29', 'title': 'Learn AI/ML ', 'iscompleted': False, 'deadline': '2025-02-03T00:00:00', 'priority': 1}]

# asyncio.run(PlanMyDay(tasks))