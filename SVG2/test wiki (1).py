
# coding: utf-8

# In[55]:

import json
from pattern.web import URL, DOM

TARGET_URL = "https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_population_density"
    
file_url = URL(TARGET_URL)
file_dom = DOM(file_url.download())
output_file = 'output.json'

i = 0
infoList = []

# retrieve countries and densities...
table = file_dom('table')[0]
for row in table('tr'):
    tempDict = {}
    if len(row('td')) > 0:
        tempDict['country'] = row('td')[1]('a')[0].content
        tempDict['density'] = row('td')[5].content
        infoList.append(tempDict)

endinfoList = {}
endinfoList['points'] = infoList
with open('output.json', 'w') as output:
    json.dump(endinfoList, output, encoding="cp1252")


# In[52]:

print extract_densities()['Canada']


# In[49]:

print info


# In[ ]:



