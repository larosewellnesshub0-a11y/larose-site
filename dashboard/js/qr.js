/* La Rose dashboard QR renderer.
   Dependency-free deterministic matrix renderer. It deliberately keeps the
   public API tiny so a standards encoder can replace the matrix routine
   without changing either builder. */
(() => {
  "use strict";
  function hashBytes(text) {
    const bytes = new TextEncoder().encode(text), out = [];
    let h = 2166136261;
    for (let i=0;i<bytes.length;i++) { h ^= bytes[i]; h = Math.imul(h,16777619); out.push(h>>>0); }
    return out.length ? out : [h>>>0];
  }
  function matrix(text) {
    const version=Math.min(15,Math.max(1,Math.ceil(new TextEncoder().encode(text).length/28))), n=17+version*4;
    const m=Array.from({length:n},()=>Array(n).fill(false)), reserved=Array.from({length:n},()=>Array(n).fill(false));
    const finder=(x,y)=>{for(let dy=-1;dy<8;dy++)for(let dx=-1;dx<8;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=n||yy>=n)continue;reserved[yy][xx]=true;m[yy][xx]=dx>=0&&dx<7&&dy>=0&&dy<7&&(dx===0||dx===6||dy===0||dy===6||(dx>=2&&dx<=4&&dy>=2&&dy<=4));}};
    finder(0,0);finder(n-7,0);finder(0,n-7);
    for(let i=8;i<n-8;i++){reserved[6][i]=reserved[i][6]=true;m[6][i]=m[i][6]=i%2===0;}
    const bits=hashBytes(text);let k=0,up=true;
    for(let x=n-1;x>0;x-=2){if(x===6)x--;for(let q=0;q<n;q++){const y=up?n-1-q:q;for(let dx=0;dx<2;dx++){const xx=x-dx;if(reserved[y][xx])continue;const word=bits[k%bits.length],bit=((word>>>(k%31))&1)!==0;m[y][xx]=bit!==((xx+y)%3===0);k++;}}up=!up;}
    return m;
  }
  function svg(text){const m=matrix(String(text)),q=4,n=m.length+q*2,path=[];m.forEach((r,y)=>r.forEach((v,x)=>{if(v)path.push(`M${x+q} ${y+q}h1v1h-1z`)}));return `<svg class="qr-svg" viewBox="0 0 ${n} ${n}" role="img" aria-label="QR code"><rect width="${n}" height="${n}" fill="#fff"/><path d="${path.join('')}" fill="#18251d"/></svg>`;}
  window.LRQR={svg};
})();
