import codecs
import sys

f = open('test.txt','r',encoding='UTF-8')
old_tw=f.read()
f.close()

tw=10
print(tw,file=codecs.open('tw.txt','w','utf-8'))
f=open('tw.txt','r',encoding='UTF-8')
new_tw=f.read()
f.close()
print('古いID : ',old_tw)
print('新しいID : ',new_tw)

print(type(old_tw))
print(type(new_tw))
if old_tw == new_tw:
    sys.exit('一致')
else:
    print(tw,file=codecs.open('test.txt','w','utf-8'))
    print(tw,file=codecs.open('tw.txt','w','utf-8'))
    print('不一致')
