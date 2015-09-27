---
layout: post
title: How I Got My School's ICSE Exam Results.
date: '2012-06-07T00:47:00+05:30'
tags:
- icse
- development
- hacks
tumblr_url: http://www.aviraldg.com/post/24552761747/how-i-got-my-schools-icse-exam-results
---
First, have a look at [ICSE Results (Loyola)](https://dl.dropboxusercontent.com/u/16632318/results.html) and [Prizewinners/Toppers (ICSE)](http://dl.dropbox.com/u/16632318/toppers.html).

It was as simple as this (farily hackish) Python script (which uses the awesome requests and BeautifulSoup libraries):

{% highlight python %}
#!/usr/bin/env python

import sqlite3
import requests
import bs4
import datetime

SOURCE_URI = 'http://server2.examresults.net/icseX12-res.aspx'

def main(args):
    assert len(args) >= 2
    conn = sqlite3.connect('icse{0}.db'.format(args[1]))
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS results (school_code int, index_no int primary key, name text, school text, dob date,
    eng int, hin int, eed int, hcg int, mat int, sci int, cta int, eas int);''')

    center = int(args[1])
    roll = 1
    while True:
        response = requests.post(SOURCE_URI, {'center1': center, 'sno1': '{0:03}'.format(roll)}).text
        if 'does not exist' in response:
            conn.close()
            return
        roll += 1
        soup = bs4.BeautifulSoup(response)
        metatable, table = soup.find_all('table', 'sp6')
        data = [None] + [row.find_all('td')[1].contents[0].string.title() for row in metatable.find_all('tr')]
        data[0], data[1] = data[1].split('/')[1:]
        marks = []
        for mark in [row.find_all('td')[1].contents[0].string for row in table.find_all('tr')[1:-2]]:
            if mark == 'XXX':
                marks.append(None)
            else:
                marks.append(int(mark))
        data.extend(marks)
        if 'EAS' in response:
            data.insert(-1, None)
        else:
            data.append(None)
        data[4] = datetime.date(*reversed(map(int, data[4].split('/'))))
        c.execute('''INSERT INTO results values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', data)
        print '{0}'.format(roll-1)
        conn.commit()

if __name__=='__main__':
    import sys
    main(sys.argv)
{% endhighlight %}


Edit/Note: If you’re planning to use this for your own school, you should probably note that it doesn’t take subjects other than the ones taught at Loyola into account, so results exported for other schools may be incorrect.
