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
        "Assign priorities to these tasks based on deadline (closest first) and type of task like health>wordk>academics>household work ,give proper priority "
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
# Define your tasks with deadlines and types
tasks = [{'_id': '6797f2b32b0fe3329bfb6383', 'title': 'complete AI agent', 'iscompleted': False, 'deadline': '2025-01-29T00:00:00', 'priority': 1}, {'_id': '6797f2ce2b0fe3329bfb6384', 'title': 'Learn AI/ML', 'iscompleted': False, 'deadline': '2025-01-31T00:00:00', 'priority': 1}, {'_id': '6797fe623ff76687e71de375', 'title': 'wash clothes', 'iscompleted': False, 'deadline': '2025-01-29T00:00:00', 'priority': 1}]

# # Get the prioritized response
# response = client.chat.complete(
#     model=model,
#     messages=messages,
#     response_format={"type": "json_object"}
# )
response=PriorityTask(tasks)
# # Print and use the result
# print(response)
# print(response.choices[0].message.content)

# # Optional: Parse the JSON response
# prioritized_tasks = json.loads(response.choices[0].message.content)
print(response)
# print("\nPrioritized Tasks:")
# for task in prioritized_tasks['tasks']:
#     print(f"{task['priority']}: {task['title']} ({task['type']}) due {task['deadline']}")