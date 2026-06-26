<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="description" content="GrayCo Construction Services — General Contractor in Bartlett, TN."/>
<title>GrayCo Construction Services | General Contractor | Memphis, TN</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
</head>
<body>
<div id="root"></div>
<script>
(async function(){
  var KEY='grayco-site-content-v3';
  var GET_FN='/.netlify/functions/get-content';
  var SAVE_FN='/.netlify/functions/save-content';

  // ── FIX: redirect Cloudinary uploads to the correct account ──────────────
  // The built app has the wrong cloud name baked in ('grayco'); rewrite it
  // to the real one ('dzewujlvg') so photos upload to the cloud instead of
  // filling up browser storage.
  var _origFetch = window.fetch;
  window.fetch = function(url, opts){
    try{
      if (typeof url === 'string' && url.indexOf('cloudinary.com/v1_1/grayco/') !== -1){
        url = url.replace('cloudinary.com/v1_1/grayco/', 'cloudinary.com/v1_1/dzewujlvg/');
      }
    }catch(e){}
    return _origFetch.call(this, url, opts);
  };

  function toast(msg,color){
    var t=document.createElement('div');
    t.innerText=msg;
    t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:'+color+';color:#fff;padding:10px 24px;border-radius:8px;font-family:sans-serif;font-size:14px;z-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.3);max-width:90vw;text-align:center';
    document.body.appendChild(t);
    setTimeout(function(){t.remove();},6000);
  }

  // Load latest content via Netlify function (bypasses all caching)
  try{
    var res=await _origFetch(GET_FN,{cache:'no-store'});
    if(res.ok){
      var text=await res.text();
      try{
        var p=JSON.parse(text);
        if(p&&Object.keys(p).length>1){
          localStorage.setItem(KEY,text);
        }
      }catch(e){}
    }
  }catch(e){console.warn('[GrayCo] Cloud load failed:',e.message);}

  // Intercept saves to also push to cloud
  var _origSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
    _origSetItem.call(this,k,v);
    if(k===KEY){
      _origFetch(SAVE_FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:v})})
      .then(async function(r){
        var data={};
        try{data=await r.json();}catch(e){}
        if(r.ok&&data.ok){
          toast('☁️ Saved to cloud!','#2e7d32');
        }else{
          var reason=data.reason||data.error||('HTTP '+r.status);
          toast('❌ Cloud error: '+reason,'#c62828');
        }
      }).catch(function(e){toast('❌ Network error: '+e.message,'#c62828');});
    }
  };

  // Start the app
  var s=document.createElement('script');
  s.type='module';
  s.src='./assets/index-5ObGMj_N.js';
  document.body.appendChild(s);
})();
</script>
</body>
</html>
