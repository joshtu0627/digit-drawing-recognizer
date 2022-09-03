
class Tab{
    constructor(id){
        this.main=document.querySelector(id);
        this.ul=this.main.querySelector('.firstnav');
        this.iconBoxs=this.main.querySelectorAll('.icon_box');
        
        
        this.lis=this.ul.querySelectorAll('li');
        
        this.sections=this.main.querySelectorAll('section');

        this.remove=this.main.querySelectorAll('.close')
        this.tabscon=this.main.querySelector('.tabscon');
        
        this.init();
        console.log(this.iconBoxs);
    }
    init(){
        this.updateNode();
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].index=i;
            this.lis[i].onclick=this.toggleTab.bind(this.lis[i],this);
            // 括號中的this是大tab 但toggleTab前的this是li
        }
    }
    updateNode(){
        this.ul.querySelectorAll('li');
        this.sections=this.main.querySelectorAll('section');
        this.remove=this.main.querySelectorAll('.close');
        this.spans=this.main.querySelectorAll('.firstnav li span:first-child');
    }
    toggleTab(that){
        that.clearClass();
        console.log(this.index);
        changeType(this.index);
        console.log('pen type:'+penType);
        this.className='active';
        that.iconBoxs[this.index].classList.add('icon_active');
        that.sections[this.index].className='conactive';
        console.log(that.sections[this.index]);
    }
    clearClass(){
        for(var i=0;i<this.lis.length;i++){
            this.iconBoxs[i].classList.remove('icon_active');
            this.lis[i].className='';
            this.sections[i].className='';
        }
    }
    editTab(){
        var str=this.innerHTML;
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        this.innerHTML='<input type="text">';
        // <textarea name="" id="" cols="30" rows="10"></textarea>
        console.log(this);
        var input=this.children[0];
        var span=this;
        input.value=str;
        input.select();
        input.onkeyup=function(e){
            console.log(e.key);
            if(e.key=='Enter'){
                this.blur();
            }
        }
        input.onblur=function(){
            this.parentNode.innerHTML=this.value;
        }
    }
    editText(){
        var str=this.innerHTML;
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        this.innerHTML='<textarea name="" id="" cols="50" rows="20"></textarea>';
        
        console.log(this);
        var input=this.children[0];
        var span=this;
        input.value=str;
        input.select();
        input.onkeyup=function(e){
            console.log(e.key);
            if(e.key=='Enter'){
                this.blur();
            }
        }
        input.onblur=function(){
            this.parentNode.innerHTML=this.value;
        }
    }
}
var tab=new Tab('#tab');