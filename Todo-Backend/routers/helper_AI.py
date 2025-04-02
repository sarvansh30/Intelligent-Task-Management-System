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
                  "content": ("Below are my lists of tasks can you help me plan out my day so i can be productive with proper breaks. keep it to the point just give the plan not too much extra thoughts while making the decisions.Send reponse in suach a way that reac-markdown can easily change line or bold text etc."
                              f"Tasks: {json.dumps(tasks)}"),
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
                  "content": ("Below is a task i am want to perform can you give me dreiction in points on how to do that with resources i should checkout to successfully complete the task."
                              f"Task: {json.dumps(task)}"),
              },
        ],
    )

    async for chunk in response:
        if chunk.data.choices[0].delta.content is not None:
            yield chunk.data.choices[0].delta.content

