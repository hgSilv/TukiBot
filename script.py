import json;

out = json.loads(open('running-tasks.json', 'r').read())
if(len(out)>1):
    print(str(out['taskArns'][0]))