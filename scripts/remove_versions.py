with open("requirements.txt", 'r', encoding='utf-16-le') as file:
    lines = file.readlines()

lines = [ line.split('==')[0] + '\n' for line in lines ] 

with open("requirements.txt", 'w', encoding='utf-16-le') as file:
    file.writelines(lines)