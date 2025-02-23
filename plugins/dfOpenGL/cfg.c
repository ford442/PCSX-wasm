#include "cfg.h"
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <sys/stat.h>

extern GpuConfS gpuConfig;
char * pConfigFile=NULL;

#define GetValue(name, var) \
 p = strstr(pB, name); \
 if (p != NULL) { \
  p+=strlen(name); \
  while ((*p == ' ') || (*p == '=')) p++; \
  if (*p != '\n') var = atoi(p); \
 }

void readconfig()
{
 struct stat buf;
 FILE *in;char t[256];int len, size;
 char * pB, * p;
 gpuConfig.bFullscreen=FALSE;
 gpuConfig.bBilinear=TRUE;
 gpuConfig.nMaxTextures=64;
 gpuConfig.bWireFrame=FALSE;
 gpuConfig.bAntialias=TRUE;
 gpuConfig.bClearScreen=FALSE;
 gpuConfig.FrameLimit=TRUE;
 gpuConfig.windowX=1280;
 gpuConfig.windowY=960;
 return;
 if(pConfigFile)
      strcpy(t,pConfigFile);
 else
  {
   strcpy(t,"dfopengl.cfg");
   in = fopen(t,"rb");
   if (!in)
    {
     strcpy(t,"cfg/dfopengl.cfg");
     in = fopen(t,"rb");
     if(!in) sprintf(t,"%s/.pcsx/plugins/dfopengl.cfg",getenv("HOME"));
     else    fclose(in);
    }
   else     fclose(in);
  }

 if (stat(t, &buf) == -1) return;
 size = buf.st_size;
 in = fopen(t,"rb");
 if (!in) return;
 pB=(char *)malloc(size);
 memset(pB,0,size);
 len = fread(pB, 1, size, in);
 fclose(in);
 free(pB);
}

void writeconfig()
{
}

void ExecCfg(char *arg) {
	char cfg[256];
	struct stat buf;
	strcpy(cfg, "./cfgDFOpenGL");
	if (stat(cfg, &buf) != -1) {
		sprintf(cfg, "%s %s", cfg, arg);
		system(cfg); return;
	}

	strcpy(cfg, "./cfg/cfgDFOpenGL");
	if (stat(cfg, &buf) != -1) {
		sprintf(cfg, "%s %s", cfg, arg);
		system(cfg); return;
	}

	sprintf(cfg, "%s/.pcsx/plugins/cfg/cfgDFOpenGL", getenv("HOME"));
	if (stat(cfg, &buf) != -1) {
		sprintf(cfg, "%s %s", cfg, arg);
		system(cfg); return;
	}

	printf("ERROR: cfgDFOpenGL file not found!\n");
}
