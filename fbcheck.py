import urllib.request
url = 'https://www.facebook.com/v18.0/plugins/page.php?adapt_container_width=true&app_id=&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfc130120cabd1472a%26domain%3D127.0.0.1%26is_canvas%3Dfalse%26origin%3Dhttp%253A%252F%252F127.0.0.1%253A4173%252Ffc9821c4cfdaf3571%26relation%3Dparent.parent&container_width=498&height=700&hide_cover=false&href=https%3A%2F%2Fwww.facebook.com%2FKeilaSPA&locale=et_EE&sdk=joey&show_facepile=false&small_header=true&tabs=timeline&width=500'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'http://127.0.0.1:4173/',
})
with urllib.request.urlopen(req) as resp:
    print(resp.status)
    print(resp.getheader('content-type'))
    print(resp.read(1000).decode('utf-8', errors='replace'))
