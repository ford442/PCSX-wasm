/***************************************************************************
                          draw.c  -  description
                             -------------------
    begin                : Sun Oct 28 2001
    copyright            : (C) 2001 by Pete Bernert
    email                : BlackDove@addcom.de
 ***************************************************************************/
/***************************************************************************
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version. See also the license.txt file for *
 *   additional informations.                                              *
 *                                                                         *
 ***************************************************************************/

#define _IN_DRAW

#include "externals.h"
#include "gpu.h"
#include "draw.h"
#include "prim.h"
#include "menu.h"
#include "interp.h"
#include "swap.h"

int            iResX;
int            iResY;
long           lLowerpart;
BOOL           bIsFirstFrame = TRUE;
BOOL           bCheckMask = FALSE;
unsigned short sSetMask = 0;
unsigned long  lSetMask = 0;
int            iDesktopCol = 16;
int            iShowFPS = 0;
int            iWinSize; 
int            iMaintainAspect = 0;
int            iUseNoStretchBlt = 0;
int            iFastFwd = 0;
int            iDebugMode = 0;
int            iFVDisplay = 0;
PSXPoint_t     ptCursorPoint[8];
unsigned short usCursorActive = 0;

#include <SDL2/SDL.h>
#include <sys/ipc.h>
#include <sys/shm.h>

int xv_port = -1;
int xv_id = -1;
int xv_depth = 0;
int yuv_port = -1;
int yuv_id = -1;
int use_yuv = 0;
int xv_vsync = 0;
int finalw,finalh;
#include <time.h>

SDL_Surface *sdl_display;
SDL_Surface *sdl_ximage;

char *               Xpixels;
char *               pCaptionText;

int fx=0;

void DestroyDisplay(void){
  SDL_FreeSurface(sdl_ximage);
  SDL_FreeSurface(sdl_display);
  SDL_Quit();
}
int depth=32;
int root_window_id=0;
SDL_Rect srcrect;
SDL_Rect dstrect;
void CreateDisplay(void){
SDL_Init(SDL_INIT_VIDEO|SDL_INIT_JOYSTICK);	
SDL_Window* sdl_window=SDL_CreateWindow("PCSX",SDL_WINDOWPOS_UNDEFINED,SDL_WINDOWPOS_UNDEFINED,640,480,SDL_WINDOW_OPENGL);  
SDL_Renderer sdl_surface=SDL_CreateRenderer(sdl_window,-1,SDL_RENDERER_ACCELERATED);
SDL_SetHint(SDL_HINT_RENDER_SCALE_QUALITY,"linear");
SDL_RenderSetLogicalSize(sdl_surface,640,480);
}}

void BlitSDL32(SDL_Surface *surface, int32_t x, int32_t y){
 unsigned char *pD;
 unsigned int startxy;
 uint32_t lu, lr, lg, lb;
 unsigned short s;
 unsigned short row, column;
 unsigned short dx = PreviousPSXDisplay.Range.x1;
 unsigned short dy = PreviousPSXDisplay.DisplayMode.y;
 int32_t lPitch = surface->pitch;//PSXDisplay.DisplayMode.x << 2;
 uint32_t *destpix;

 if (SDL_MUSTLOCK(surface)) SDL_LockSurface(surface);
 if (PSXDisplay.RGB24){
   for (column = 0; column < dy; column++){      
     startxy = ((1024) * (column + y)) + x;
     pD = &psxVub[startxy*2];
     destpix = (uint32_t *)(surface->pixels + (column * lPitch));
     for (row = 0; row < dx; row++){      
       lr = pD[0];
       lg = pD[1];
       lb = pD[2];
       destpix[row] = 0xff000000 | (lb << 16) | (lg << 8) | (lr);
       pD += 3;
      }}}else{
   for (column = 0;column<dy;column++){
     startxy = (1024 * (column + y)) + x;
     destpix = (uint32_t *)(surface->pixels + (column * lPitch));
     for (row = 0; row < dx; row++){
       s = GETLE16(&psxVuw[startxy++]);
      destpix[row] = (((s << 3) & 0xf8) | ((s << 6) & 0xf800) | ((s << 9) & 0xf80000)) | 0xff000000;
      }}}
  if (SDL_MUSTLOCK(surface)) SDL_UnlockSurface(surface);
}
extern time_t tStart;

inline void MaintainAspect(unsigned int *dx,unsigned int *dy,unsigned int *dw,unsigned int *dh){
	int t;
	if (*dw * 3 > *dh * 4) {
		t = *dh * 4.0f / 3;
		*dx = (*dw - t) / 2;
		*dw = t;
	} else {
		t = *dw * 3.0f / 4;
		*dy = (*dh - t) / 2;
		*dh = t;
	}}

void DoBufferSwap(void){  
  BlitSDL32(sdl_ximage, PSXDisplay.DisplayPosition.x, PSXDisplay.DisplayPosition.y);
  // SDL_Flip(sdl_ximage);
	//         SDL_RenderPresent(sdl_ximage);

  dstrect.x=0;
  dstrect.y=0;
  dstrect.w=iResX;
  dstrect.h=iResY;
  srcrect.x=0;
  srcrect.y=0;
  srcrect.w=PSXDisplay.DisplayMode.x;
  srcrect.h=PSXDisplay.DisplayMode.y;
  SDL_BlitScaled(sdl_ximage, &srcrect, sdl_display, &dstrect);
 //  SDL_Flip(sdl_display);
	//        SDL_RenderPresent(renderer);

}

void DoClearScreenBuffer(void){
}

void DoClearFrontBuffer(void){
}

unsigned long ulInitDisplay(void){
CreateDisplay();
return (unsigned long) 1;
}

void CloseDisplay(void){
DestroyDisplay();
}

void ShowGpuPic(void){
}

void ShowTextGpuPic(void){
}
