CC=emcc
CXX=em++
CFLAGS= -pthread -sUSE_PTHREADS=1 -sPTHREAD_POOL_SIZE=4 --closure 0 -sSUPPORT_BIG_ENDIAN=1 -sFULL_ES3=1 -D USESDLSOUND -Wpointer-sign \
-DNDEBUG -sSUPPORT_ERRNO=0 -sGL_DEBUG=0 -sGL_TRACK_ERRORS=0 \
-sGL_POOL_TEMP_BUFFERS=0 -sMEMORY64=0 -sLEGALIZE_JS_FFI=0 -sWASM_BIGINT=1 \
-sFORCE_FILESYSTEM=1 -lidbfs.js \
-sMAXIMUM_MEMORY=4GB \
-sELIMINATE_DUPLICATE_FUNCTIONS=1 -sALLOW_MEMORY_GROWTH=1 -sMALLOC="emmalloc" -sINITIAL_MEMORY=1400mb \
-sUSE_WEBGL2=1 -sMIN_WEBGL_VERSION=1 -sMAX_WEBGL_VERSION=2 -O2 -Wno-unused-result -sUSE_ZLIB=1 -I./include -I./libpcsxcore
LDFLAGS=

# WORKER
WORKER_EXPORT="['_main', '_pcsx_init', '_one_iter', '_get_ptr', '_ls']"
WORKER_OBJS=gui/workerMain.o gui/Plugin.o gui/Config.o \
libpcsxcore/psxbios.o libpcsxcore/cdrom.o libpcsxcore/psxcounters.o \
libpcsxcore/psxdma.o libpcsxcore/disr3000a.o libpcsxcore/spu.o libpcsxcore/sio.o \
libpcsxcore/psxhw.o libpcsxcore/mdec.o libpcsxcore/psxmem.o libpcsxcore/misc.o \
libpcsxcore/plugins.o libpcsxcore/decode_xa.o libpcsxcore/r3000a.o libpcsxcore/psxinterpreter.o \
libpcsxcore/gte.o libpcsxcore/psxhle.o libpcsxcore/psxcommon.o \
libpcsxcore/cdriso.o libpcsxcore/ppf.o \
plugins/dfxvideo/cfg.o plugins/dfxvideo/fps.o plugins/dfxvideo/key.o \
plugins/dfxvideo/prim.o plugins/dfxvideo/zn.o plugins/dfxvideo/draw_null.o \
plugins/dfxvideo/gpu.o plugins/dfxvideo/soft.o \
plugins/dfsound/spu.o plugins/dfsound/cfg.o  plugins/dfsound/dma.o plugins/dfsound/registers.o plugins/dfsound/worker.o \
plugins/sdlinput/cfg.o plugins/sdlinput/pad_worker.o plugins/sdlinput/analog.o
WORKER_FLAGS= -sUSE_SDL=2 --post-js js/worker_funcs.js -s"EXPORTED_RUNTIME_METHODS=['cwrap','ccall','getValue','setValue']" -sEXPORTED_FUNCTIONS=$(WORKER_EXPORT)

UI_EXPORT="['_main','_get_ptr', '_render','_LoadPADConfig', '_CheckKeyboard', '_CheckJoy', '_SoundFeedStreamData', '_SoundGetBytesBuffered']"
UI_OBJS=plugins/sdlinput/cfg.o plugins/sdlinput/xkb.o gui/wwGUI.o \
plugins/sdlinput/sdljoy.o plugins/sdlinput/analog.o plugins/dfsound/sdl.o  
UI_FLAGS= -sUSE_SDL=1 -sEXPORTED_FUNCTIONS=$(UI_EXPORT) -s"EXPORTED_RUNTIME_METHODS=['cwrap','ccall','getValue','setValue']"


ALL: pcsx_worker.js pcsx_ww.js

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)

%.o: %.cc
	$(CC) -x c++ -std=gnu++2b -c -o $@ $< $(CFLAGS)

gui/xbrz.o: gui/xbrz.cpp gui/xbrz.h
	$(CC) -c -o $@ $(CFLAGS) -x c++ -std=gnu++2b -DNDEBUG $<

pcsx_worker.js: $(WORKER_OBJS) js/worker_funcs.js
	$(CXX) -o $@ $(CFLAGS) $(WORKER_OBJS) $(LDFLAGS) $(WORKER_FLAGS)

pcsx_ww.js: $(UI_OBJS)
	$(CXX) -o $@ $(CFLAGS) $(UI_OBJS) $(LDFLAGS) $(UI_FLAGS)

clean:
	rm -f *.o */*.o */*/*.o
