function initNamePage(){
  const c=document.getElementById('nameContainer');
  let names=[];
  function render(){
    c.innerHTML='';
    names.forEach((n,i)=>{
      const inp=document.createElement('input');
      inp.value=n;
      inp.oninput=e=>{names[i]=e.target.value};
      c.appendChild(inp);
      c.appendChild(document.createElement('br'));
    });
  }
  document.getElementById('add').onclick=function(){
    if(names.length<10){names.push('');render();}
  };
  document.getElementById('next').onclick=function(){
    localStorage.setItem('names',JSON.stringify(names.filter(n=>n.trim().length>0)));
    location.href='weights.html';
  };
  names=['',''];
  render();
}

function initWeightsPage(){
  const names=JSON.parse(localStorage.getItem('names')||'[]');
  const c=document.getElementById('weightsContainer');
  let weights=new Array(names.length).fill(100);
  names.forEach((n,i)=>{
    const div=document.createElement('div');
    div.innerHTML=n+': ';
    const r=document.createElement('input');
    r.type='range';r.min=0;r.max=100;r.value=100;
    r.oninput=e=>{weights[i]=parseInt(e.target.value)};
    div.appendChild(r);
    c.appendChild(div);
  });
  document.getElementById('next').onclick=function(){
    localStorage.setItem('weights',JSON.stringify(weights));
    location.href='wheel.html';
  };
}

function initWheelPage(){
  const names=JSON.parse(localStorage.getItem('names')||'[]');
  const weights=JSON.parse(localStorage.getItem('weights')||'[]');
  const canvas=document.getElementById('wheel');
  const ctx=canvas.getContext('2d');
  const total=weights.reduce((a,b)=>a+b,0);
  let angle=0;
  names.forEach((n,i)=>{
    const slice=2*Math.PI*(weights[i]/total);
    ctx.beginPath();
    ctx.moveTo(250,250);
    ctx.arc(250,250,250,angle,angle+slice);
    ctx.fillStyle=`hsl(${i*50},70%,60%)`;
    ctx.fill();
    angle+=slice;
  });
  document.getElementById('spin').onclick=function(){
    const r=Math.random()*total;
    let acc=0,win=0;
    for(let i=0;i<weights.length;i++){
      acc+=weights[i];
      if(r<=acc){win=i;break;}
    }
    document.getElementById('winner').innerText='Gewonnen: '+names[win];
  };
}
