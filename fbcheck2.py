import urllib.request, urllib.parse, socket
socket.setdefaulttimeout(20)
for page_url in ['https://www.facebook.com/KeilaSPA/', 'https://www.facebook.com/KeilaSPA']:
    src = 'https://www.facebook.com/plugins/page.php?href=' + urllib.parse.quote(page_url, safe='') + '&tabs=timeline&width=500&height=700&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false'
    req = urllib.request.Request(src, headers={'User-Agent':'Mozilla/5.0', 'Referer':'https://keila.advent.ee/'})
    print('URL=', src)
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read(2000).decode('utf-8', errors='replace')
            print('status', resp.status)
            print('type', resp.getheader('content-type'))
            print('contains login', 'login' in data.lower())
            print('contains sorry', 'sorry' in data.lower())
            print('contains blocked', 'blocked' in data.lower())
            print('contains page', 'page' in data.lower())
            print('snippet:', data[:600].replace('\n', ' '))
    except Exception as e:
        print('ERROR', e)
