private function createEMP(param1:Sprite, param2:int, param3:int) : void
      {
         var var5:Bitmap = null;
         var var6:Number = NaN;
         var var7:int = 0;
         var var8:MovieClip = null;
         var var4:SWFFinisher = SWFFinisher(ResourceManager.fileCollection.getFinisher("shockwaves"));
         if(param1 != null)
         {
            var5 = ResourceManager.getBitmap("lensFlash","lensFlash"); //first like the full size of emp
            var5.x = -var5.width * 0.5;
            var5.y = -var5.height * 0.5;
            param1.addChild(var5);
            TweenLite.to(var5,0.25,{
               "alpha":0,
               "onComplete":this.removeFromParent,
               "onCompleteParams":[var5,param1]
            });
            var6 = 0;
            var7 = 0;
            while(var7 < 5) //4 rings of emp
            {
               TweenMax.delayedCall(var6,this.showEMPRing,[var4,param1,var7]);
               var6 = var6 + 0.1;
               var7++;
            }
            var8 = MovieClip(var4.getEmbededMovieClip("blitz")); //electrical things expand as the first spawned ring does to max size of 729x729
            ScreenManager.playAnimation(var8,15,true);
            var8.scaleX = 0.1;
            var8.scaleY = 0.1;
            param1.addChild(var8);
            TweenLite.to(var8,1.5,{
               "scaleX":3.5,
               "scaleY":3.5,
               "onComplete":this.removeFromParent,
               "onCompleteParams":[var8,param1]
            });
            TweenMax.delayedCall(0.75,this.fadeOutBolt,[var8]);
            AudioManager.playSoundEffect(43,false,false,param2,param3);
         }
      }