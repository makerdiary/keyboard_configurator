<template>
  <div id="controller-bottom" class="botctrl">
    <Veil :isVisible="isVeilOpened">
      <template #contents>
        <div class="input-url-modal">
          <div>
            <label for="url-import-field">Url:</label>
            <input
              ref="urlimport"
              id="url-import-field"
              type="text"
              v-model="urlImport"
            />
          </div>
          <div>
            <button @click="importUrlkeymap">Load</button>
            <button @click="closeVeil">cancel</button>
          </div>
        </div>
      </template>
    </Veil>
    <div class="botctrl-1-1">
      <button
        v-if="false"
        class="fixed-size"
        id="toolbox"
        :title="$t('downloadKeymap.title')"
        @click="downloadKeymap"
        v-bind:disabled="disableDownloadKeymap"
      >
        <font-awesome-icon icon="download" size="lg" fixed-width />
        {{ $t('downloadKeymap.label') }}
      </button>
      <button
        v-if="false"
        class="fixed-size"
        id="source"
        @click="downloadSource"
        :title="$t('downloadSource.title')"
        v-bind:disabled="disableDownloadSource"
      >
        <font-awesome-icon icon="download" size="lg" fixed-width />
        {{ $t('downloadSource.label') }}
      </button>
      <button id="export" @click="exportJSON" :title="$t('downloadJSON.title')">
        <font-awesome-icon icon="download" size="lg" fixed-width />
      </button>
      <span class="label-button">{{ $t('downloadJSON.label') }}</span>
      <button id="import" :title="$t('importJSON.title')" @click="importKeymap">
        <font-awesome-icon icon="upload" size="lg" fixed-width />
      </button>
      <button
        id="import-url"
        :title="$t('importUrlJSON.title')"
        @click="openVeil"
      >
        <font-awesome-icon icon="cloud-upload-alt" size="lg" fixed-width />
      </button>
      <button
        id="printkeymaps"
        :title="$t('printKeymap.title')"
        @click="printKeymaps"
      >
        <font-awesome-icon icon="print" size="lg" fixed-width />
        <span class="hide-small">{{ $t('printKeymap.label') }}</span>
      </button>
      <button id="testkeys" :title="$t('testKeys.title')" @click="testKeys">
        <font-awesome-icon icon="keyboard" size="lg" fixed-width />
        <span class="hide-small">{{ $t('testKeys.label') }}</span>
      </button>
      <input
        id="fileImport"
        type="file"
        ref="fileImportElement"
        accept="application/json"
        @change="fileImportChanged"
      />
      <input
        id="infoPreview"
        type="file"
        accept="application/json"
        ref="infoPreviewElement"
        @change="infoPreviewChanged"
      />
    </div>
    <div v-if="this.electron" class="botctrl-1-2">
      <ElectronBottomControls :disableDownloadBinary="disableDownloadBinary">
      </ElectronBottomControls>
    </div>
    <div v-else class="botctrl-1-2">
      <button id="load" @click="load" :title="$t('load keymap from device')">
        <font-awesome-icon icon="upload" size="lg" fixed-width />
      </button>
      <span class="label-button">device</span>
      <button id="apply" :title="$t('download keymap to device')" @click="apply">
        <font-awesome-icon icon="download" size="lg" fixed-width />
        <!-- <span v-if="isDirty">*</span> -->
      </button>
      <button
        v-if="false"
        id="fwFile"
        @click="downloadFirmware"
        :title="$t('downloadFirmware.title')"
        v-bind:disabled="disableDownloadBinary"
      >
        <font-awesome-icon icon="download" size="lg" fixed-width />
        download
      </button>
    </div>
    <div v-if="downloadElementEnabled">
      <a
        ref="downloadElement"
        v-bind:href="urlEncodedData"
        v-bind:download="filename"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import first from 'lodash/first';
import isUndefined from 'lodash/isUndefined';
import escape from 'lodash/escape';
const encoding = 'data:text/plain;charset=utf-8,';
import { clearKeymapTemplate } from '@/common.js';
import { PREVIEW_LABEL } from '@/store/modules/constants';
import {
  load_converted_keymap,
  disableCompileButton,
  disableOtherButtons,
  getPreferredLayout,
  checkInvalidKeymap
} from '@/jquery';

import ElectronBottomControls from './ElectronBottomControls';

import remap from '@/remap';
import tmk from '@/tmk';
import { webusb } from '@/webusb';

export default {
  name: 'bottom-controller',
  components: { ElectronBottomControls },
  computed: {
    ...mapState('app', [
      'keyboard',
      'layout',
      'previewRequested',
      'enableDownloads',
      'firmwareBinaryURL',
      'firmwareSourceURL',
      'keymapSourceURL',
      'author',
      'notes',
      'electron'
    ]),
    ...mapGetters('keymap', ['isDirty']),
    ...mapGetters('app', ['exportKeymapName', 'firmwareFile']),
    disableDownloadKeymap() {
      return !this.enableDownloads && this.keymapSourceURL !== '';
    },
    disableDownloadSource() {
      return !this.enableDownloads && this.firmwareSourceURL !== '';
    },
    disableDownloadBinary() {
      return (
        !this.enableDownloads ||
        isUndefined(this.firmwareBinaryURL) ||
        this.firmwareBinaryURL === ''
      );
    }
  },
  watch: {
    /**
     * isPreview.
     * When isPreview changes we click the infoPreview element.
     * @param {Bool} newValue isPreview has changed
     * @return {null} nothing
     */
    previewRequested(newValue) {
      if (newValue) {
        this.$refs.infoPreviewElement.click();
        window.setTimeout(() => this.dismissPreview());
      }
    }
  },
  methods: {
    ...mapMutations('app', ['dismissPreview', 'stopListening', 'startListening']),
    ...mapActions('app', ['loadKeymapFromUrl']),
    importUrlkeymap: function() {
      this.loadKeymapFromUrl(this.urlImport)
        .then(data => {
          this.loadJsonData(data);
        })
        .catch(() => {
          alert('Seems like there is an issue trying to get the file');
        });
      this.closeVeil();
    },
    openVeil: function() {
      this.isVeilOpened = true;
      this.stopListening();
      Vue.nextTick(() => {
        this.$refs.urlimport.focus();
      });
    },
    closeVeil: function() {
      this.startListening();
      this.urlImport = '';
      this.isVeilOpened = false;
    },
    exportJSON() {
      //Squashes the keymaps to the api payload format, might look into making this a function
      let layers = this.$store.getters['keymap/exportLayers']({
        compiler: false
      });

      //API payload format
      let data = {
        keyboard: this.keyboard,
        keymap: this.exportKeymapName,
        layout: this.layout,
        layers: layers,
        author: this.author,
        notes: this.notes
      };

      console.log(data);
      var layerArray = []
      for (let i = 0; i < data.layers.length; i++) {
        layerArray.push('# layer ' + i +
                          '\n' +
                          '(' +
                          '\n' +
                          data.layers[i] +
                          '\n' +
                          '),' +
                          '\n')
      }
      var pythonKeymap =  '# Keybaord: ' + data.keyboard + '\n' +
                          '# Keymap: ' + data.keymap + '\n' +
                          '# Layout: ' + data.layout + '\n' +
                          '# Author: ' + data.author + '\n' +
                          '# Notes: ' + data.notes + '\n' +
                          'KEYMAP = (' + '\n' +
                          layerArray.join("") +
                        ')'
      this.download(
        `${this.$store.getters['app/exportKeymapName']}.py`,
        pythonKeymap
      );
    },
    load() {
      webusb.connect().then(device => {
        console.log('connected');
        // Vue.notify({
        //   text: 'Connected to keyboard',
        //   type: 'success'
        // });
        device.read(0x0, 8*8*2*8).then(result => {
          device.close();

          var buf = new Uint16Array(result.data.buffer);
          console.log(buf);
          var index = 0;
          var keymap = [];
          for (var n=0; n<8; n++) {
              var codes = Array.from(buf.subarray(index, index + 61));
              index += 64;
              if (codes.some(code => code != 0 && code != 1)) {
                var names = tmk.fixLayout(...codes).map((code) => tmk.toName(code));
                keymap.push(names);
              }
          }

          console.log(keymap);
          if (keymap) {
            load_converted_keymap(keymap);
            Vue.notify({
              text: 'Loaded keymap from keyboard',
              type: 'success'
            });
          } else {
            Vue.notify({
              text: 'Load a invalid keymap from keyboard',
              type: 'warn'
            });
          }
        }).catch(error => {
          Vue.notify({
            text: 'Failed to load keymap from keyboard',
            type: 'error'
          });
        });
      });
    },
    apply() {
      let layers = this.$store.getters['keymap/exportLayers']({
        compiler: false
      });

      console.log(layers);

      let keymap = [];
      for (let i=0; i<layers.length; i++) {
        let layer = layers[i].map(value => tmk.toCode(value));
        keymap.push(layer);
      }

      var n = 0;
      var write = function () {
        webusb.connect().then(device => {
          console.log('connected');
          // Vue.notify({
          //   text: 'Connected to keyboard',
          //   type: 'success'
          // });
          var data = Uint16Array.from(tmk.fixLayout(...keymap[n]));
          console.log(`write  ${n} layer`);
          console.log(data)
          device.write(n * 8 * 8 * 2, data).then(() => {
            n++;
            if (n < keymap.length) {
              write();
            } else {
              Vue.notify({
                text: 'Downloaded keymap to keyboard',
                type: 'success'
              });
              device.close();
            }
          }).catch(error => {
            Vue.notify({
              text: 'Failed to download keymap to keyboard',
              type: 'error'
            });
          });
        });
      };

      write();
    },
    download(filename, data) {
      this.urlEncodedData = encoding + encodeURIComponent(data);
      this.filename = filename;
      this.downloadElementEnabled = true;
      Vue.nextTick(() => {
        this.$refs.downloadElement.click();
        this.downloadElementEnabled = false;
      });
    },
    downloadFirmware() {
      this.urlEncodedData = first(this.firmwareBinaryURL);
      this.filename = this.$store.getters['app/firmwareFile'];
      this.downloadElementEnabled = true;
      Vue.nextTick(() => {
        this.$refs.downloadElement.click();
        this.downloadElementEnabled = false;
      });
    },
    downloadSource() {
      this.urlEncodedData = first(this.firmwareSourceURL);
      this.filename = 'source.zip';
      this.downloadElementEnabled = true;
      Vue.nextTick(() => {
        this.$refs.downloadElement.click();
        this.downloadElementEnabled = false;
      });
    },
    downloadKeymap() {
      this.urlEncodedData = first(this.keymapSourceURL);
      this.filename = 'source.zip';
      this.downloadElementEnabled = true;
      Vue.nextTick(() => {
        this.$refs.downloadElement.click();
        this.downloadElementEnabled = false;
      });
    },
    importKeymap() {
      if (this.$store.getters['keymap/isDirty']) {
        if (
          !confirm(
            clearKeymapTemplate({ action: 'change keyboard and layout' })
          )
        ) {
          return false;
        }
      }
      this.$refs.fileImportElement.click();
    },
    fileImportChanged() {
      var files = this.$refs.fileImportElement.files;
      this.reader = new FileReader();
      this.reader.onload = this.importJSONOnLoad;
      this.reader.readAsText(first(files));
      this.$refs.fileImportElement.value = ''; // clear value for chrome issue #83
    },
    // remap old keymap.json files to current locations and layouts
    // This is recursive, but it's limited to a maximum depth of 10
    remapKeyboard(keyboard, layout, depth = 0) {
      let wasRemapped = false;
      if (depth > 10) {
        console.warn(`possible remap loop detected with ${keyboard}:${layout}`);
      } else {
        if (!isUndefined(remap.lookup[keyboard])) {
          const { target, layouts } = remap.lookup[keyboard];
          if (!isUndefined(target)) {
            keyboard = target;
            wasRemapped = true;
          }
          if (!isUndefined(layouts) && !isUndefined(layouts[layout])) {
            layout = layouts[layout];
            wasRemapped = true;
          }
        }
      }
      return wasRemapped
        ? this.remapKeyboard(keyboard, layout, ++depth)
        : { keyboard, layout };
    },
    loadJsonData(data) {
      if (data.version && data.keyboard && data.keyboard.settings) {
        alert(this.$t('errors.kbfirmwareJSONUnsupported'));
        return;
      }

      if (checkInvalidKeymap(data)) {
        alert(this.$t('errors.unknownJSON'));
        return;
      }

      /* TODO Add check for keyboard name and layout */

      if (!isUndefined(data.author)) {
        const { author, notes } = data;
        this.$store.commit('app/setAuthor', escape(author));
        this.$store.commit('app/setNotes', escape(notes));
      }

      // remap old json files to new mappings if they need it
      data = Object.assign(
        data,
        this.remapKeyboard(data.keyboard, data.layout)
      );

      this.$store.commit('app/setKeyboard', data.keyboard);
      this.$store.dispatch('app/changeKeyboard', this.keyboard).then(() => {
        this.$store.commit('app/setLayout', data.layout);
        // todo validate these values
        this.$router.replace({
          path: `/${data.keyboard}/${data.layout}`
        });

        var store = this.$store;
        let promise = new Promise(resolve =>
          store.commit('keymap/setLoadingKeymapPromise', resolve)
        );
        promise.then(() => {
          const stats = load_converted_keymap(data.layers);
          const msg = this.$t('statsTemplate', stats);
          store.commit('status/deferredMessage', msg);
          store.dispatch('status/viewReadme', this.keyboard).then(() => {
            store.commit('app/setKeymapName', data.keymap);
            store.commit('keymap/setDirty');
          });
        });
        disableOtherButtons();
      });
    },
    importJSONOnLoad() {
      try {
        const data = JSON.parse(this.reader.result);
        this.loadJsonData(data);
      } catch (error) {
        console.log(error);
        alert(this.$t('errors.invalidQMKKeymap'));
        return;
      }
    },
    infoPreviewChanged() {
      var files = this.$refs.infoPreviewElement.files;
      if (files.length === 0) {
        return;
      }
      this.$store.commit('app/enablePreview');
      disableCompileButton();
      this.reader = new FileReader();
      this.reader.onload = this.previewInfoOnLoad;
      this.reader.readAsText(first(files));
      this.$refs.infoPreviewElement.value = ''; // clear value for chrome issue #83
    },
    previewInfoOnLoad() {
      const jsonText = this.reader.result;
      let data;
      try {
        data = JSON.parse(jsonText);
      } catch (error) {
        console.log(error);
        alert("Sorry, that doesn't appear to be a valid QMK info file.");
        return;
      }

      this.$store.commit('app/setKeyboard', PREVIEW_LABEL);
      /*
       * Preview Mode State hack
       * When we load a info.json preview we are bypassing the normal XHR request to the backend for
       * layouts and supplying an in memory data structure.
       * Due to a quirk in how the keymap is rendered we use a change in layout to detect changes in Visual
       * Keymap and reset the keymap there.
       * This does not always work if the layout we are transitioning too has the same name as the current layout.
       * To work around this we have to set the layout to something else temporarily to force a re-render.
       *
       * The preview code works around this problem by creating a fake keyboard layout called '  ',
       * and temporarily sets the keyboard to this value. Then it waits until the next scheduler tick and sets
       * the value to the correct one. Info.json preview mode was always a hack and needs some redesign.
       *
       * TODO come up with a better way of resetting keymap than depending on visual keymap change detection
       */
      const store = this.$store;
      this.$store.dispatch('app/loadLayouts', data).then(() => {
        // This is a special hack to get around change detection
        this.$store.commit('app/setLayout', '  ');
        Vue.nextTick(() => {
          const layout = getPreferredLayout(store.state.app.layouts);
          store.commit('keymap/clear');
          store.commit('app/setLayout', layout);
          // clear the keymap data is now responsibility of code that changes layout
          store.commit('keymap/clear');
          store.commit('app/setKeymapName', 'info.json preview');
          store.commit('status/clear');
          store.commit(
            'status/append',
            [
              'Preview info.json mode\n',
              'For Developers only, working on new keyboards.\n',
              '\tctrl, alt, u - see key sizes',
              '\tctrl, alt, n - cycle colorways',
              '\tlayout drop down to preview layouts'
            ].join('\n')
          );
        });
      });
    },
    printKeymaps() {
      this.$router.push('/print');
    },
    testKeys() {
      this.$router.push('/test');
    }
  },
  data: () => {
    return {
      isVeilOpened: false,
      downloadElementEnabled: false,
      urlEncodedData: '',
      filename: '',
      urlImport: '',
      reader: undefined
    };
  }
};
</script>
<style>
.input-url-modal {
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  width: 400px;
}
.fixed-size {
  min-width: 150px;
}
#export {
  border-radius: 4px 0 0 4px;
  margin-right: 1px;
}
#import {
  border-radius: 0 4px 4px 0;
}
#import-url {
  border-radius: 4px;
}
#load {
  border-radius: 4px 0 0 4px;
  margin-right: 1px;
}
#apply {
  border-radius: 0 4px 4px 0;
}
.input-url-modal label {
  padding-right: 5px;
}
.input-url-modal div:nth-child(2) {
  margin-top: 5px;
}
.input-url-modal button {
  line-height: 120%;
  padding: 6px 12px;
  border-width: 0;
  border-radius: 3px;
  margin: 0 0 0 4px;
  cursor: pointer;
}
#url-import-field {
  width: 340px;
  padding: 7px;
  border: 1px solid;
  border-radius: 4px;
}
.label-button {
  line-height: 155%;
  vertical-align: middle;
  display: inline-block;
  margin: -3px 1px 0 0;
  font-size: 14px;
  font-weight: bold;
  height: 19px;
  border: 0px solid;
  padding: 5px 8px;
  text-transform: uppercase;
}
@media (max-width: 90rem) {
  .hide-small {
    display: none;
  }
}
</style>
