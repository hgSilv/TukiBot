import json;

out = json.loads(open('running-tasks.json', 'r').read())
print(out['taskArns'][0])