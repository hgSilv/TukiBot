import json;

out = json.loads(open('running-tasks.json', 'r').read())
command = 'aws ecs stop-task --cluster TukiCluster --task '+ str(out['taskArns'][out['taskArns'].index(n)])
print(command)