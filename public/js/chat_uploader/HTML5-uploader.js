(function(window, undefined)
{
    "use strict";
    /**
     * [HTML5Uploader 基于FormData和FileReader的 HTML5 文件上传类]
     * @param {Object} options [description]
     */
    function HTML5Uploader(options)
    {
        var defaultOptions = {
            url: '?',
            element: null,
            fieldName: 'uploadFile',
            autoProcess: true,
            enablePaste: true,
            enableDrop: true,
            allowTypes: ['image'],
            maxSize: '0'
        };

        if(options)
        {
            for(var key in options)
            {
                if(defaultOptions.hasOwnProperty(key))
                {
                    defaultOptions[key] = options[key];
                }
            }

            this.options = defaultOptions;
        }
        else
        {
            throw new Error('HTML5Uploader.constructor params not enough.');
        }

        this.element = typeof options.element === 'string' 
                ? document.querySelector(options.element)
                : options.element;

        if(!this.element)
        {
            throw new Error('Element <' + options.element + '> not found.');
        }

        if(!HTML5Uploader.isSupported())
        {
            throw new Error('Browser doesn\'t seem to support HTML5Uploader.');
        }

        this.fileList = [];

        this.getOpt('enablePaste') && this._initPaste();
        this.getOpt('enableDrop') && this._initDrop();
    }

    HTML5Uploader.isSupported = function()
    {
        return !!(window.FormData && window.FileReader);
    };

    HTML5Uploader.fileType = function(fileName)
    {
        var ext = fileName.split('.').pop().toLowerCase(),
            type;

        if(['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(ext) !== -1)
        {
            type = 'image';
        }
        else if(['doc', 'docx'].indexOf(ext) !== -1)
        {
            type = 'doc';
        }
        else if(['rar', 'zip'].indexOf(ext) !== -1)
        {
            type = 'zip';
        }
        else if(['mp3', 'wav', 'ogg'].indexOf(ext) !== -1)
        {
            type = 'audio';
        }
        else
        {
            type = ext;
        }

        return type;
    };

    window.HTML5Uploader = HTML5Uploader;

    HTML5Uploader.prototype = {

        getOpt: function(key)
        {
            return this.options[key];
        },

        setOpt: function(key, value)
        {
            this.options[key] = value;
        },

        _getFileType: function(file)
        {
            if(!file.name)
            {
                return file.type.split('/').pop();
            }

            return (file.name || '').split('.').pop() || '';
        },

        _checkType: function(file)
        {
            var allowTypes = this.getOpt('allowTypes') || [],
                type = this._getFileType(file);

            return (allowTypes.indexOf(type) !== -1);
        },

        _checkSize: function(file)
        {
            var allowSize = (this.getOpt('maxSize') || 0).toString().toLowerCase(),
                parts = allowSize.match(/^(\d+)\s*([^\s]*)/);

            if(parts[2])
            {
                switch(parts[2][0])
                {
                    // KB
                    case 'k':
                        allowSize = parts[1] * 1024;
                        break;

                    // MB
                    case 'm':
                        allowSize = parts[1] * 1024 * 1024;
                        break;

                    // GB
                    case 'g':
                        allowSize = parts[1] * 1024 * 1024 * 1024;
                        break;

                    // Byte
                    case 'b':
                        allowSize = parts[1];
                        break;
                }
            }
            else
            {
                allowSize = parts[1];
            }

            allowSize = parseInt(parts[1]) || 0;

            if(file.size && allowSize && file.size > allowSize)
            {
                return false;
            }

            return true;
        },

        _checkFile: function(file)
        {
            var passed = 1;

            if(!this._checkType(file))
            {
                passed = 0;
                this.onError({error: 1, errorCode: 'FILE_TYPE_NOT_SUPPORTED'});
            }
            else if(!this._checkSize(file))
            {
                passed = 0;
                this.onError({error: 1, errorCode: 'FILE_SIZE_EXCEEDED'});
            }
            else
            {

            }

            return !!passed;
        },

        _initPaste: function()
        {
            var self = this;

            this.element.addEventListener('paste', function(e)
            {
                var items = e.clipboardData.items || [],
                    item;

                for(var i = 0; i < items.length; i++)
                {
                    item = items[i];

                    if(item.kind == 'file')
                    {
                        self.addFile(item.getAsFile());
                    }
                }

                self.getOpt('autoProcess') && self.process(true);
            }, false);
        },

        _initDrop: function()
        {
            var self = this;

            this.element.addEventListener('drop', function(e)
            {
                e.preventDefault();
                e.stopPropagation();

                var files = e.dataTransfer.files;

                for(var i = 0; i < files.length; i++)
                {
                    self.addFile(files[i]);
                }

                self.getOpt('autoProcess') && self.process(true);
            }, false);

            this.element.addEventListener('dragover', function(e)
            {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        },

        process: function(autoProcess)
        {
            var file = this.fileList.shift();

            if(file)
            {
                var xhr = this.uploadFile(file);

                this.onProcess(xhr, autoProcess);

                return xhr;
            }
        },

        addFile: function(file)
        {
            this.fileList.push(file);

            return this;
        },

        uploadFile: function(file) 
        {
            if(!this._checkFile(file))
            {
                this.process();
                return false;
            }

            if(this.onBeforeUpload() === false)
            {
                return false;
            }

            // prepare XMLHttpRequest
            var xhr = new XMLHttpRequest(),
                self = this;

            xhr.open('post', this.getOpt('url'), true);

            xhr.onload = function(e) 
            {
                self.process();
                self.onSuccess(xhr);
            };
            xhr.onerror = function(e) 
            {
                self.process();
                self.onError(xhr);
            };
            xhr.upload.onprogress = function(e)
            {
                self.onProgress(e);
            };
            xhr.upload.onloadstart = function(e) 
            {
                self.onStart(e);
            };
     
            // prepare FormData
            var formData = new FormData();
            formData.append(this.getOpt('fieldName'), file, 
                    file.name || ('blob.' + file.type.substr('image/'.length)));
            xhr.send(formData);

            return xhr;
        },

        onBeforeUpload: function(){},
        onStart: function(){},
        onProgress: function(){},
        onSuccess: function(){},
        onError: function(){},
        onProcess: function(){}
    };
})(window);