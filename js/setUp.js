function opn(){
setTimeout(function(){
document.getElementById('shut').innerHTML=2;
document.getElementById("circle").width=window.innerWidth;
document.getElementById("circle").height=window.innerHeight;
let $hg=window.innerHeight+"px";
document.getElementById("wrap").style.lineheight=$hg;
document.getElementById("di").click();
},1500);
};
