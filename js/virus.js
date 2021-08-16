   
    //定义定时器变量(多次)
    var time_userMove;
    var time_creatShouter;
    var time_shouterMove;
    var time_createEnemy;
    var time_enemyMove;
    var time_creatEnemyShouter;
    var time_enemyShouterMove;
    var time_lifeTime;
    var time_score;
    var time_bossOneMove;
    var time_creatBossShouter;
    var time_bossShouterMove;
    var time_buff_AddScore;
    var time_buff_creatReduceMove;
    var time_buff_creatRedouble;
    var time_buff_creatLife;
    var time_buff_move;
    //定义定时器变量(一次)
    var time_createBossOne;
    //定义数组对象
    var shout=[];
    var em_array=[];
    var em_array_shout=[];
    var bossShout=[];
    var buff_array_score=[];
    var buff_array_reduceMove=[];
    var buff_array_redouble=[];
    var buff_array_life=[];

 /*创建用户飞机 封装用户类*/
    var score=0;//分数
    var user;//实例化的全局变量
    function User(){
        this.width=60;
        this.height=70;
        this.position="absolute";
        this.userf=null;
        this.src="../images/game/myplane.png";
        this.x;
        this.y;
        this.life=3;
        this.speed=10;
        this.speed_start=10;
        //构造创建用户飞机的方法
        this.createUser=function(){
            if(this.userf==null){
                this.userf=document.createElement("img");
                this.userf.style.width=this.width+"px";
                this.userf.style.height=this.height+"px";
                this.userf.style.position=this.position;
                this.userf.style.zIndex=1;
                this.userf.src=this.src;
                this.userf.style.left="170px";//400/2-60/2
                this.userf.style.top="530px";//720-70-30
                map.appendChild(this.userf);
            }
        };
        //构造用户飞机移动方法
        this.userMove=function(x,y){  //传参 利用地图鼠标移动事件获取鼠标坐标控制
            this.x=x;
            this.y=y;
            this.userf.style.left=x+"px";
            this.userf.style.top=y+"px";
        }
    }
/*创建子弹 封装用户子弹类*/
    var shouter;
    function Shouter(){
        this.width=10;
        this.height=40;
        this.shouterf=null;
        this.position="absolute";
        this.src="../images/game/userShouter.png";
        this.x;
        this.y;
        //构造创建子弹的方法
        this.creatShouter=function(User){
            if(this.shouterf==null){
                this.shouterf=document.createElement("img");
                this.shouterf.style.width=this.width+"px";
                this.shouterf.style.height=this.height+"px";
                this.shouterf.style.position=this.position;
                this.shouterf.style.zIndex=1;
                this.shouterf.src=this.src;
                map.appendChild(this.shouterf);
                //子弹坐标 x=飞机left+飞机自身的一半-子弹自身一半
                //y=飞机top-飞机自身的一半
                this.x=parseInt(User.userf.style.left)+User.width/2-this.width/2;
                this.y=parseInt(User.userf.style.top)-User.height/2;
            }
            this.shouterf.style.left=this.x+"px";
            this.shouterf.style.top=this.y+"px";
        };
        //构造子弹移动的方法
        this.shouterMove=function(index,array){
            this.y-=2; //子弹的top值
            if(this.y<=0){//当子弹飞出屏幕 移除创建的子弹及其实例化对象
                this.shouterf.remove();
                array.splice(index,1);//移除实例化数组中的子弹 利用数组截取的方法;index规定删除位置，1是删除数量
            }
            this.creatShouter();//改变top后继续创建子弹形成连续发射效果
        };
        //构造子弹打到敌机移除二者的方法
        this.shouterEnemy=function(enemyarr,index,shoutarr){  //传参 子弹数组 敌机数组 移除所用缩引
            for(var key in enemyarr){ //遍历敌机数组
                //判断 子弹x y 值范围在敌机区域 移除
                if(this.x>enemyarr[key].x-this.width&&this.x<enemyarr[key].x+enemyarr[key].width
                    &&this.y>enemyarr[key].y-this.height&&this.y<enemyarr[key].y+enemyarr[key].height){
                    //大小敌机血量不同 当血量为0时  移除被击打的敌机及其实例化对象
                    enemyarr[key].blood-=1;
                    if(enemyarr[key].blood<=0){
                        score+=enemyarr[key].score;
                        enemyarr[key].enemyf.remove();
                        enemyarr.splice(key,1);     
                    }
                    //同时移除击打中敌机的子弹及实例化对象
                    this.shouterf.remove();
                    shoutarr.splice(index,1);
                }
            }
        }
        //构造子弹打到boss降低boss血量的方法
        this.shouterBoss=function(boss,index,shoutarr,bossShoutarr){
                //判断 子弹x y 值范围在boss区域 移除
                if(this.x>boss.x-this.width&&this.x<boss.x+boss.width
                    &&this.y>boss.y-this.height&&this.y<boss.y+boss.height){
                    //大小敌机血量不同 当血量为0时  移除被击打的敌机及其实例化对象
                    boss.blood-=1;
                    if(boss.blood==0){
                    	//清除boss1的生成
                    	boss.bossStyle.parentNode.removeChild(boss.bossStyle);
                    	for (var i = 0; i < bossShoutarr.length; i++) {
                    		bossShoutarr[i].bossShouterStyle.parentNode.removeChild(bossShoutarr[i].bossShouterStyle);
                    	}
                    	clearInterval(time_bossOneMove);
                    	//boss消失，停止生成子弹
                    	clearInterval(time_creatBossShouter);
                    	clearInterval(time_bossShouterMove);
            
                        score+=1000;
                        //清除boss的属性信息
                        setNone('boss-property');
                    }
                    //同时移除击打中敌机的子弹及实例化对象
                    this.shouterf.remove();
                    shoutarr.splice(index,1);
                }
        }
    }

/*创建敌机 封装敌机类*/
    var enemy;
    function Enemy(width,height,blood,score,s){
        //敌机分为2种
        this.width=width||100;
        this.height=height||80;
        this.blood=blood||3;
        this.score=score||10;
        this.scoreStart=score||10;
        this.enemyf=null;
        this.src=s||"../images/game/plane.png";
        this.speed=2;
        this.position="absolute";
        this.x;//x轴 left
        this.y;//y轴 top
        this.enemyType;
        //构造创建敌机的方法
        this.createEnemy=function(){
            if(this.enemyf==null){
                this.enemyf=document.createElement("img");
                this.enemyf.style.width=this.width+"px";
                this.enemyf.style.height=this.height+"px";
                this.enemyf.style.position=this.position;
                this.enemyf.style.zIndex=20;
                this.enemyf.src=this.src;
                map.appendChild(this.enemyf);
                //随机产生起始线不同位置的敌机
                this.x=Math.random()*(800-this.width);
                this.y=-this.height;
            }
            this.enemyf.style.left=this.x+"px";
            this.enemyf.style.top=this.y+"px";
        }
        //构造敌机下落的方法
        this.enemyMove=function(index,array){
            //改变敌机的top值 赋回去
            this.y+=this.speed;
            if(this.y>720){//敌机飞出界面 移除创建的敌机及实例化对象
                this.enemyf.remove();
                array.splice(index,1);//移除实例化数组中的敌机 利用数组截取的方法
                // count++;
            }
            this.enemyf.style.top=this.y+"px";
        }
        //构造敌机下落碰撞用户飞机的方法
        this.enemyUser=function(index,array){
        	
	            //在敌机下落过程中判断是否与飞机相撞 相撞游戏结束
	            if(user.x>this.x-user.width&&user.x<this.x+this.width
	             &&user.y>this.y-user.height&&user.y<this.y+this.height)
	            {
	            	user.life--;
	            	if(user.life>0){
	            		this.enemyf.remove();
	                    array.splice(index,1);
	            		getClass("life-plane")[user.life].style.display="none";
	            	}else{
	            		getClass("life-plane")[0].style.display="none";
	            		//用户飞机被毁，清除计时器
		                gameOver();
		                // alert("Game over");
		                return;
	            		
	            	}
	            }
        }
        
    }
    
    /*封装敌机子弹*/
    var emenyShouter;
    function EnemyShouter(width,height,src){
    	this.enemyType;
        this.enemyShouterStyle=null;
        this.enemyShouterX;
        this.enemyShouterY;
        this.width=width;
        this.height=height;
        this.src=src;
    	//敌机的子弹
        this.creaeEnemyShouter=function(x,y){
        	if (this.enemyShouterStyle==null) {
	        	this.enemyShouterStyle=document.createElement("img");
	            this.enemyShouterStyle.style.width=this.width+"px";
	            this.enemyShouterStyle.style.height=this.height+"px";
	            this.enemyShouterStyle.style.position="absolute";
	            this.enemyShouterStyle.style.zIndex=20;
	            this.enemyShouterStyle.style.opacity=0.8;
	            this.enemyShouterStyle.src=this.src;
	            map.appendChild(this.enemyShouterStyle);
	            this.enemyShouterX=x;
	        	this.enemyShouterY=y;
        	}
        	this.enemyShouterStyle.style.left=this.enemyShouterX+"px";
            this.enemyShouterStyle.style.top=this.enemyShouterY+"px";
        }
        //敌机子弹的移动
        this.enemyShouterMove=function(index,array){
        		this.enemyShouterY+=5;
        	if(this.enemyShouterX<0||this.enemyShouterX>800||this.enemyShouterY>720){
        		this.enemyShouterStyle.remove();
                array.splice(index,1);
        	}
        	this.enemyShouterStyle.style.left=this.enemyShouterX+"px";
            this.enemyShouterStyle.style.top=this.enemyShouterY+"px";
            //敌机子弹与用户飞机的碰撞检测
            if(user.x>this.enemyShouterX-user.width&&user.x<this.enemyShouterX+this.width
	             &&user.y>this.enemyShouterY-user.height&&user.y<this.enemyShouterY+this.height)
	            {
	            	user.life--;
	            	if(user.life>0){
	            		this.enemyShouterStyle.remove();
	                    array.splice(index,1);
	            		getClass("life-plane")[user.life].style.display="none";
	            	}else{
	            		getClass("life-plane")[0].style.display="none";
	            		//用户飞机被毁，清除计时器
		                gameOver();
		                // alert("Game over");
		                return;
	            		
	            	}
	            }
        }
      
    }
    /*封装boss类*/   
    function Boss(src,blood){
    	this.width=150;
    	this.height=120;
    	this.bloodSum=blood;
    	this.blood=blood;	
    	this.src=src;
    	this.bossStyle=null;
    }
    //原型来写,创造boss生成
	Boss.prototype.creatBoss=function(){
		if(this.bossStyle==null){
	    	this.bossStyle=document.createElement("img");
	        this.bossStyle.style.width=this.width+"px";
	       	this.bossStyle.style.height=this.height+"px";
	        this.bossStyle.style.position="absolute";
	        this.bossStyle.style.zIndex=40;
	        this.bossStyle.src=this.src;
	        map.appendChild(this.bossStyle);
		}
    }
    //boss的移动
    var a=0,b=0,bossX=350,bossY=0;
    Boss.prototype.bossMove=function(){
     	if(bossX<=0){
	    	a=0;
	    }else if(bossX>=800-this.width){
	    	a=1;
	    }
	    if(bossY<=0){
	    	b=0;
	    }else if (bossY>=100) {
	    	b=1;
	    }
	    if(a==0){
	    	bossX+=5;
	    }else if(a==1){
	    	bossX-=5;
	    }
	    if(b==0){
	    	bossY+=5;
	    }else if(b==1){
	    	bossY-=5;
	    }
    }
    //boss的位置
    Boss.prototype.bossPosition=function(bossX,bossY){
    	this.x=bossX;
    	this.y=bossY;
    	this.bossStyle.style.left=this.x+'px';
        this.bossStyle.style.top=this.y+'px';
    }

    /*boss的子弹*/
    function BossShouter(Boss,src,speed){
    	this.width=30;
    	this.height=30;
    	this.src=src;
    	this.bossShouterStyle=null;
    	this.x;
    	this.y;
    	this.boss=Boss;
    	this.degree=Math.random()*Math.PI*2;
    	this.speed=speed;
    }
    //生成boss的子弹
    BossShouter.prototype.createBossShouter=function(){
    	if(this.bossShouterStyle==null){
	    	this.bossShouterStyle=document.createElement("img");
	        this.bossShouterStyle.style.width=this.width+"px";
	       	this.bossShouterStyle.style.height=this.height+"px";
	        this.bossShouterStyle.style.position="absolute";
	        this.bossShouterStyle.style.zIndex=40;
	        this.bossShouterStyle.src=this.src;
	        map.appendChild(this.bossShouterStyle);
	        this.x=parseInt(this.boss.bossStyle.style.left)+this.boss.width/2-this.width/2;
	        this.y=parseInt(this.boss.bossStyle.style.top)+this.boss.height/2;
    	}
    	this.bossShouterStyle.style.left=this.x+"px";
        this.bossShouterStyle.style.top=this.y+"px";

    }
    //boss子弹的移动
    BossShouter.prototype.bossShouterMove=function(index,array){
    	this.y+=this.speed*Math.sin(this.degree);; //子弹的top值
    	this.x+=this.speed*Math.cos(this.degree);
    	if (this.y<0) {
			this.degree=-this.degree;
		}
        if (this.x < 0 || this.x > 800) {
			this.degree=Math.PI-this.degree;
		}
        if(this.y>=720||this.boss.blood<=0){//当子弹飞出屏幕 移除创建的子弹及其实例化对象
         	this.bossShouterStyle.remove();
            array.splice(index,1);//移除实例化数组中的子弹 利用数组截取的方法;index规定删除位置，1是删除数量
        }
        this.createBossShouter(this.boss);//改变top后继续创建子弹形成连续发射效果

        //在boss子弹下落过程中判断是否与飞机相撞 
	            if(user.x>this.x-user.width&&user.x<this.x+this.width
	             &&user.y>this.y-user.height&&user.y<this.y+this.height)
	            {	
	            	this.bossShouterStyle.remove();
	                array.splice(index,1);
	            	user.life--;
	            	if(user.life>0){
	            		getClass("life-plane")[user.life].style.display="none";
	            	}else{
	            		getClass("life-plane")[0].style.display="none";
		                gameOver();
		                // alert("Game over");
		                return;
	            		
	            	}
	            }
    }
    //boss血条
    function blood(bossName,bossBloodSum,bossBlood,bossIcon){
        setBlock('boss-property');
        getID('boss-name').innerHTML=bossName;
        getID('blood').innerHTML=bossBlood;
        getID('blood').style.width=bossBlood/bossBloodSum*100+'%';
        getID('boss-img').src=bossIcon;
    }

    /*封装buff类*/
    function buff(src,speed){
    	this.width=30;
    	this.height=30;
    	this.src=src;
    	this.x;
    	this.y;
    	this.speed=speed;
    	this.buffStyle=null;
    	//创造buff
    	this.creatBuff=function(){
    		if (this.buffStyle==null) {
	    		this.buffStyle=document.createElement("img");
		        this.buffStyle.style.width=this.width+"px";
		       	this.buffStyle.style.height=this.height+"px";
		        this.buffStyle.style.position="absolute";
		        this.buffStyle.style.zIndex=40;
		        this.buffStyle.src=this.src;
		        map.appendChild(this.buffStyle);
		        this.x=Math.random()*(800-this.width);
                this.y=-this.height;
    		}
    		this.buffStyle.style.left=this.x+"px";
        	this.buffStyle.style.top=this.y+"px";
    	}
    	//buff移动
    	this.buffMove=function(buffType,index,array){
    		if (buffType=="金币") {
	    		//改变敌机的top值 赋回去
	            this.x+=this.speed/5;
        	}else if (buffType=="移动减益") {
        		this.x-=this.speed/5;
        	}
	        this.y+=this.speed;
	        if(this.y>720||this.x>800||this.x<0){//敌机飞出界面 移除创建的敌机及实例化对象
	            this.buffStyle.remove();
	            array.splice(index,1);//移除实例化数组中的敌机 利用数组截取的方法
	        }
	        this.buffStyle.style.top=this.y+"px";
	        this.buffStyle.style.left=this.x+"px";

	        //在敌机下落过程中判断是否与飞机相撞 相撞游戏结束
	            if(user.x>this.x-user.width&&user.x<this.x+this.width
	             &&user.y>this.y-user.height&&user.y<this.y+this.height)
	            {
	            	this.buffStyle.remove();
		            array.splice(index,1);
	            	if (buffType=="金币") {
		            	score+=20;	
	            	}else if (buffType=="移动减益"){
	            		var time_moveBuff;
	            		var moveBuff_index=0;
	            		time_moveBuff=setInterval(function(){
	            			moveBuff_index++;
		            		if (moveBuff_index<=5) {
								user.speed=user.speed_start/2;	
		            		}else{
		            			clearInterval(time_moveBuff);
		            			moveBuff_index=0;
		            			user.speed=user.speed_start;
		            		}
	            		},1000);
	            	}else if(buffType=="分数翻倍"){
	            		var time_redoubleBuff;
	            		var redoubleBuff_index=0;
	            		time_redoubleBuff=setInterval(function(){
	            			redoubleBuff_index++;
		            		if (redoubleBuff_index<=10) {
								enemy.score=enemy.scoreStart*2;
		            		}else{
		            			clearInterval(time_redoubleBuff);
		            			redoubleBuff_index=0;
		            			
		            		}
	            		},1000);
	            	}else if(buffType=="增加生命"){
	            		if (user.life<=2) {
	            			if (getClass("life-plane")[user.life].style.display=="none") {
	            				getClass("life-plane")[user.life].style.display="inline-block";
	            				user.life++;
	            			}
	            		}
	            	}

	            }
    	}
    }
    //时间转换（秒——时分秒）  存活时间
    var second=0,minute=0,hour=0;
    function lifeTime(){
    	second++;
    	if(second>59){
    		minute++;
    		second=0;
    		if(minute>59){
    			hour++;
    			minute=0;
    		}
    	}
    	getID("life-time").innerHTML="时间："+hour+"时"+minute+"分"+second+"秒";
    }
    /**
    *   游戏暂停的方法
    */
    var clickIndex=0;
    function gamePause(){
        clickIndex++;
        if(clickIndex%2!=0&&user.life>0){
            clearTimer();
            getID('back-music').pause();
            getID('pause').innerHTML="继续游戏";
        }else{
            getID('back-music').play();
            gameStart();
            getID('pause').innerHTML="暂停游戏";
        }
    }
    /*
    *   游戏结束方法
    */
    function gameOver(){
        //清除计时器
        clearTimer();
        getID('back-music').pause();//暂停背景音乐
        getID('game-over-music').play();//调用游戏结束的音乐
        //弹出游戏所获得的分数和所用时间
        alert("游戏结束","分数："+score+" \n "+getID("life-time").innerHTML);
        //移除游戏暂停的点击事件
        removeEventHandler(getID("pause"),'click',gamePause);

    }
    function gameStartBack(){
        /*创建地图 地图移动*/
        (function (){    //(function(){})();即自调用函数function(){}
            var bgmap=document.getElementsByClassName("bgmap");
            //设置背景图片初始top值
            bgmap[0].style.top="-720px";
            bgmap[1].style.top="0px";
            //封装背景图片由上自下移动事件
            function bgmove(){
                for(var i=0;i<bgmap.length;i++){
                    var Top=parseInt(bgmap[i].style.top);
                    Top++;
                    if(Top>=720){
                        Top=-720;
                    }
                    bgmap[i].style.top=Top+"px";
                }
            }
            setInterval(bgmove,30);
        })();
        //实例化用户飞机 调用创建方法
            user=new User();
            user.createUser();
    }
    /**
    *  游戏运行时的方法
    */
    var userX=170;
    var userY=530;
    function gameStart(){
        var map=getID("map");
        var isBossOne=false;
         
        //按键事件控制飞机移动
                    
            var moveLeft,moveRight,moveUp,moveDown;
        //写键盘的按下事件可以移动，抬起事件不可以移动，为了防止飞机在移动过程中出现卡顿
        document.onkeydown=function(event){
            switch(window.event.keyCode){
                case 37:
                    moveLeft=true;
                    break;
                case 39:
                    moveRight=true;
                    break;
                case 38:
                    moveUp=true;
                    break;
                case 40:
                    moveDown=true;
                    break;
            }
        }
        document.onkeyup=function(event){
            switch(window.event.keyCode){
                case 37:
                    moveLeft=false;
                    break;
                case 39:
                    moveRight=false;
                    break;
                case 38:
                    moveUp=false;
                    break;
                case 40:
                    moveDown=false;
                    break;
            }
        }
        //计时器 调用用户飞机的移动方法
        time_userMove=setInterval(function(){
            if (moveLeft&&userX>0) {
                userX-=user.speed;
            }else if(moveRight&&userX<800-user.width){
                userX+=user.speed;
            }else if(moveUp&&userY>0){
                userY-=user.speed;
            }else if(moveDown&&userY<720-user.height){
                userY+=user.speed;
            }
            user.userMove(userX,userY);
        },40);
        
        //实例化子弹 调用创建方法
            time_creatShouter=setInterval(function(){
                shouter=new Shouter();
                shouter.creatShouter(user);
                shout.push(shouter);
            },200);
            //调用子弹移动方法
            time_shouterMove=setInterval(function(){
                if(shout.length>0){
                    for(var i=0;i<shout.length;i++){
                        shout[i].shouterMove(i,shout);
                        if(em_array.length>0){ //当存在敌机时 被击中会移除
                            if(shout[i]==undefined)
                                return;//处理当飞机飞到顶端的bug
                            shout[i].shouterEnemy(em_array,i,shout);
                            //boss存在用户飞机打怪物子弹生效
                            if (isBossOne) {
                                if (bossOne.blood>=0) {
                                    if(shout[i]==undefined)
                                        return;
                                    shout[i].shouterBoss(bossOne,i,shout,bossShout);
                                }
                            }
                        }
                    }
                }
            },5);

            //实例化敌机 调用创建方法
            time_createEnemy=setInterval(function(){
                //利用随机数控制大小敌机创建比例
                if(Math.random()<0.5){
                    enemy=new Enemy();
                    enemy.createEnemy();
                    em_array.push(enemy);
                    enemy.enemyType=0;
                }else if(Math.random()>=0.5&&Math.random()<0.9){
                    enemy=new Enemy(130,100,5,30,"../images/game/emplane.png");
                    enemy.createEnemy();
                    em_array.push(enemy);
                    enemy.enemyType=1;
                }else{
                    enemy=new Enemy(80,60,10,50,"../images/game/plane3.png");
                    enemy.createEnemy();
                    em_array.push(enemy);
                    enemy.enemyType=2;
                }
            },1000);
            //调用敌机移动方法
            time_enemyMove=setInterval(function(){
                if(em_array.length>0){
                    for(var key in em_array){
                        em_array[key].enemyMove(key,em_array);
                        em_array[key].enemyUser(key,em_array);
                    }
                }
            },15);
            //调用敌机的生成子弹的方法
            time_creatEnemyShouter=setInterval(function(){
                if(em_array.length>0){
                    for(var key in em_array){
                        if (em_array[key].y>30) {
                            emenyShouter=new EnemyShouter(10,30,"../images/game/enemyShouter.png");
                            emenyShouter.creaeEnemyShouter(em_array[key].x+em_array[key].width/2-10,em_array[key].y);
                            em_array_shout.push(emenyShouter);      
                        }
                    } 
                }
            },3000);
            //调用敌机子弹移动的方法
            time_enemyShouterMove=setInterval(function(){
                if(em_array_shout.length>0){
                    for(var key in em_array_shout){
                        if(em_array_shout[key]==undefined)
                            return;
                        em_array_shout[key].enemyShouterMove(key,em_array_shout);
                    }
                }
            },15);
            //计算存活时间
            time_lifeTime=setInterval(lifeTime,1000);
            //计算分数 
            time_score=setInterval(function(){
                getID("score").innerHTML="分数："+score;
            },100);
            //生成boss1
            var bossOne;
            var bossOneBlood=30;
            var bossOneShouterSpeed=1;
            time_createBossOne=setInterval(function(){
                bossOne=new Boss("../images/game/boss2.png",bossOneBlood);
                bossOne.creatBoss();
                isBossOne=true;
                blood("黄金狮王",bossOne.bloodSum,bossOne.blood,"../images/game/boss2.png");
                //boss1的移动方式
                time_bossOneMove=setInterval(function(){
                    bossOne.bossMove();
                    bossOne.bossPosition(bossX,bossY);
                },100);
                //实例化boss子弹
                var bossShouter;
                time_creatBossShouter=setInterval(function(){
                    bossShouter=new BossShouter(bossOne,"../images/game/boss2bullet.png",bossOneShouterSpeed); 
                    bossShouter.createBossShouter();
                    bossShout.push(bossShouter);
                    //调用boss发射子弹的音乐
                    getID('boss-shouter-music').play();
                },2000);
                //调用boss子弹移动方法
                time_bossShouterMove=setInterval(function(){
                    if(bossShout.length>0){
                        for(var i=0;i<bossShout.length;i++){
                            if(bossShout[i]==undefined)
                            return;
                            bossShout[i].bossShouterMove(i,bossShout);
                            if (bossOne.blood>=0) {
                                 //显示boss的属性，受到攻击血量减少
                                blood("黄金狮王",bossOne.bloodSum,bossOne.blood,"../images/game/boss2.png");
                            }
                        }
                    }
                },10);  
                bossOneBlood+=20;
                bossOneShouterSpeed+=1;
            },90000);//90秒后出现第一个boss

            //调用金币buff的方法
            var buff_addScore;
            time_buff_AddScore=setInterval(function(){
                buff_addScore=new buff("../images/game/money.png",2);
                buff_addScore.creatBuff();
                buff_array_score.push(buff_addScore);
            },10000);
            //调用移动减益buff
            var buff_reduceMove;
            time_buff_creatReduceMove=setInterval(function(){
                buff_reduceMove=new buff("../images/game/reduceMove.png",2);
                buff_reduceMove.creatBuff();
                buff_array_reduceMove.push(buff_reduceMove);
            },15000);
            //调用分数翻倍buff
            var buff_redouble;
            time_buff_creatRedouble=setInterval(function(){
                buff_redouble=new buff("../images/game/redouble.png",2);
                buff_redouble.creatBuff();
                buff_array_redouble.push(buff_redouble);
            },25000);
            //调用生命buff
            var buff_life;
            time_buff_creatLife=setInterval(function(){
                buff_life=new buff("../images/game/myplane.png",4);
                buff_life.creatBuff();
                buff_array_life.push(buff_life);
            },35000);
            /*buff移动方法*/
            time_buff_move=setInterval(function(){
                //调用金币buff的移动方法
                if(buff_array_score.length>0){
                    for(var key in buff_array_score){
                        if(buff_array_score[key]==undefined)
                            return;
                        buff_array_score[key].buffMove("金币",key,buff_array_score);
                    }
                }
                //调用移动减益buff的移动方法
                if(buff_array_reduceMove.length>0){
                    for(var key in buff_array_reduceMove){
                        if(buff_array_reduceMove[key]==undefined)
                            return;
                        buff_array_reduceMove[key].buffMove("移动减益",key,buff_array_reduceMove);
                    }
                }
                //调用分数翻倍buff的移动方法
                if(buff_array_redouble.length>0){
                    for(var key in buff_array_redouble){
                        if(buff_array_redouble[key]==undefined)
                            return;
                        buff_array_redouble[key].buffMove("分数翻倍",key,buff_array_redouble);
                    }
                }
                //调用生命buff的移动
                if(buff_array_life.length>0){
                    for(var key in buff_array_life){
                        if(buff_array_life[key]==undefined)
                            return;
                        buff_array_life[key].buffMove("增加生命",key,buff_array_life);
                    }
                }
            },15);
    }

    /**
    *   重新开始游戏的方法
    */
    function refresh(){
        if (user.life<=0) {
            window.location.reload();
        }
    }
    /*
    *	用户飞机生命为0，移除计时器
    */
    function clearTimer(){
    	clearInterval(time_userMove);
		clearInterval(time_creatShouter);
		clearInterval(time_shouterMove);
		clearInterval(time_createEnemy);
		clearInterval(time_enemyMove);
		clearInterval(time_creatEnemyShouter);
    	clearInterval(time_enemyShouterMove);
		clearInterval(time_lifeTime);
		clearTimeout(time_createBossOne);
		clearInterval(time_bossOneMove);
		clearInterval(time_creatBossShouter);
		clearInterval(time_bossShouterMove);
		clearInterval(time_buff_AddScore);
    	clearInterval(time_buff_creatReduceMove);    	
    	clearInterval(time_buff_creatRedouble);    
    	clearInterval(time_buff_creatLife);
    	clearInterval(time_buff_move);
    	
    }
   
window.onload = function (){

	/*点击开始游戏进入游戏界面*/
	getID('btn-start').onclick=function(){
		setBlock('map');
		setNone('game-face');
		//开启背景音乐
		getID('back-music').play();
		//加载游戏参数
		gameStartBack();
		gameStart();
	}
	/*点击关于游戏弹出游戏简介*/
	getID('btn-about').onclick=function(){
		alert("游戏说明","上下左右控制用户飞机的方向，自动发射子弹；敌机会随机刷新，boss会定时出现；地图会随机刷新buff（增益buff、减益buff）；击毁敌机和boss会有相应的加分。");
	}
	/*游戏暂停*/
	addEventHandler(getID("pause"),'click',gamePause);

}

/**
*   封装的自定义对话框
*/
window.alert = function(strTitle,strContent){
	     var shield = document.createElement("div");
	     shield.id = "shield";
	     shield.style.position = "absolute";
	     shield.style.left = "0px";
	     shield.style.top = "0px";
	     shield.style.width = "100%";
	     shield.style.height = document.body.scrollHeight+"px";
	     //弹出对话框时的背景颜色
	     shield.style.background = "#fff";
	     shield.style.textAlign = "center";
	     shield.style.zIndex = "25";
	     
	     var alertFram = document.createElement("div");
	     alertFram.id="alertFram";
	     alertFram.style.position = "absolute";
	     alertFram.style.left = "50%";
	     alertFram.style.top = "50%";
	     alertFram.style.marginLeft = "-250px";
	     alertFram.style.marginTop = "-75px";
	     alertFram.style.width = "500px";
	     alertFram.style.height = "150px";
	     alertFram.style.background = "#ff0000";
	     alertFram.style.textAlign = "center";
	     alertFram.style.lineHeight = "150px";
	     alertFram.style.zIndex = "300";
	     strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;width:100%\">\n";
	     strHtml += " <li style=\"background:#DD828D;text-align:left;padding-left:20px;font-size:14px;font-weight:bold;height:25px;line-height:25px;border:1px solid #F9CADE;\">["+strTitle+"]</li>\n";
	     strHtml += " <li style=\"background:#fff;text-align:center;font-size:18px;height:120px;line-height:30px;border-left:1px solid #F9CADE;border-right:1px solid #F9CADE;word-break:break-all;\">"+strContent+"</li>\n";
	     strHtml += " <li style=\"background:#FDEEF4;text-align:center;font-weight:bold;height:25px;line-height:25px; border:1px solid #F9CADE;\"><input type=\"button\" value=\"确 定\" onclick=\"doOk();refresh()\" /></li>\n";
	     strHtml += "</ul>\n";
	     alertFram.innerHTML = strHtml;
	     document.body.appendChild(alertFram);
	     document.body.appendChild(shield);
	     this.doOk = function(){
	         alertFram.style.display = "none";
	         shield.style.display = "none";
	     }
	     alertFram.focus();//使其获取焦点
	     document.body.onselectstart = function(){return false;};//禁止选中文本
}







