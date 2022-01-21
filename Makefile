CC=emcc
CXX=em++
CFLAGS= -sFULL_ES2=1 -sFULL_ES3=0 -sGL_TESTING=1 -D USESDLSOUND -Wpointer-sign \
 -sOFFSCREEN_FRAMEBUFFER=1 -sELIMINATE_DUPLICATE_FUNCTIONS=1 \
-ffast-math -sUSE_SDL=1 -O3 -Wno-unused-result -sFORCE_FILESYSTEM=1 -s USE_ZLIB=1 -I./include -I./libpcsxcore 
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
WORKER_FLAGS= --post-js js/worker_funcs.js -s"EXPORTED_RUNTIME_METHODS=['cwrap','ccall','getValue','setValue']" -sEXPORTED_FUNCTIONS=$(WORKER_EXPORT)

UI_EXPORT="['_main','_get_ptr', '_render','_LoadPADConfig', '_CheckKeyboard', '_CheckJoy', '_SoundFeedStreamData', '_SoundGetBytesBuffered']"
UI_OBJS=plugins/sdlinput/cfg.o plugins/sdlinput/xkb.o gui/wwGUI.o \
plugins/sdlinput/sdljoy.o plugins/sdlinput/analog.o plugins/dfsound/sdl.o  
UI_FLAGS= -sEXPORTED_FUNCTIONS=$(UI_EXPORT) -s"EXPORTED_RUNTIME_METHODS=['cwrap','ccall','getValue','setValue']"


ALL: pcsx_worker.js pcsx_ww.js

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)

%.o: %.cc
	$(CC) -x c++ -std=c++17 -c -o $@ $< $(CFLAGS)

gui/xbrz.o: gui/xbrz.cpp gui/xbrz.h
	$(CC) -c -o $@ $(CFLAGS) -x c++ -std=c++17 -DNDEBUG $<

pcsx_worker.js: $(WORKER_OBJS) js/worker_funcs.js
	$(CXX) -o $@ $(CFLAGS) $(WORKER_OBJS) $(LDFLAGS) $(WORKER_FLAGS)

pcsx_ww.js: $(UI_OBJS)
	$(CXX) -o $@ $(CFLAGS) $(UI_OBJS) $(LDFLAGS) $(UI_FLAGS)

clean:
	rm -f *.o */*.o */*/*.o
