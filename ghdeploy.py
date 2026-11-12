import json, base64, urllib.request, urllib.error, os, time
tok=open(r".\saku-phone\bin\.gh_token").read().strip()
H={"Authorization":"token "+tok,"User-Agent":"x","Accept":"application/vnd.github+json"}
def api(method,path,payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    r=urllib.request.Request("https://api.github.com"+path, data=data, method=method)
    for k,v in H.items(): r.add_header(k,v)
    if data: r.add_header("Content-Type","application/json")
    try:
        with urllib.request.urlopen(r, timeout=120) as resp: return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e: return e.code, json.loads(e.read() or b"{}")

repo="sakuyax-yushi"
st,r=api("GET",f"/repos/nooo-milktea/{repo}")
if st!=200:
    st,r=api("POST","/user/repos",{"name":repo,"private":False,"description":"Sakuya × Yushi fan site","auto_init":False})
print("repo", st, r.get("full_name"))

root=r".\fan-site"
files=[]
for dp,_,fs in os.walk(root):
    if ".git" in dp: continue
    for f in fs:
        if f in ("deploy.py","prep.py","ghcheck.py"): continue
        full=os.path.join(dp,f); rel=os.path.relpath(full,root).replace("\\","/")
        files.append((rel,full))
ok=0
for rel,full in files:
    data=base64.b64encode(open(full,"rb").read()).decode()
    st,cur=api("GET",f"/repos/nooo-milktea/{repo}/contents/{rel}")
    payload={"message":"add "+rel,"content":data,"branch":"main"}
    if st==200: payload["sha"]=cur["sha"]
    st,res=api("PUT",f"/repos/nooo-milktea/{repo}/contents/{rel}",payload)
    if st in (200,201): ok+=1
    else: print("fail",rel,st)
print("uploaded",ok,"/",len(files))
st,p=api("POST",f"/repos/nooo-milktea/{repo}/pages",{"source":{"branch":"main","path":"/"}})
print("pages",st, p.get("html_url") or p.get("message"))
