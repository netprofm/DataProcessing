# code van http://stackoverflow.com/questions/19697846/python-csv-to-json
# Chris Olberts
# laatste komma dient handmatig verwijderd te worden!!!

import csv
import json

# open and make the files
csvfile = open('KNMI.csv', 'r')
jsonfile = open('KNMI.json', 'w')

# make titles
fieldnames = ("Date", "Avg. Windspeed", "High Windspeed", "Low Windspeed")
reader = csv.DictReader(csvfile, fieldnames)

# write the data in a csv file
jsonfile.write("{'points': [")
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write(',\n')
jsonfile.write("]}")
