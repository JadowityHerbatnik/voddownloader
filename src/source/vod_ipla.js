var VOD_IPLA = (function() {
    var properties = new Configurator({
        wrapper: {
            selector: '#player-wrapper, #playerContainer'
        },
        button: {
            class: 'vod_ipla_downlaod_button'
        },
        chainSelector: function(){
            return ['videos', 'subtitles'];
        },
        asyncChains: {
            videos: [
                new Step({
                    urlTemplate: 'https://distro.redefine.pl/partner_api/v1/2yRS5K/media/#media_id/vod/player_data?' +
                        'dev=pc&os=linux&player=html&app=firefox&build=12345',
                    beforeStep: function (input) {
                        return {media_id: idParser()};
                    },
                    afterStep: COMMON_SOURCE.grabIplaVideoData
                })
            ],
            subtitles: [
                new Step({
                    afterStep: function (output) {
                        return parseSubtitleData();
                    }
                })
            ]
        },
        formatter: COMMON_SOURCE.iplaFormatter
    });

    var getJson = function(){
        var match = $('script:not(:empty)').text().match(/(window\.CP\.embedSetup\()(.*)\);/);
        var jsonObject = JSON.parse(match[2]);
        return JSON.parse(jsonObject[0].media);
    };

    var idParser = function(){
        try {
            if($('#player-wrapper').length > 0) {
                return (((getJson() || {}).result || {}).mediaItem || {}).id;
            }
            else if($('#playerContainer').length > 0){
                return getMediaId();
            }
        }
        catch(e){
            throw new Exception(config.error.id, Tool.getRealUrl());
        }
    };

    var getMediaId = function(){
        var match = $('script:not(:empty)').text().match(/mediaId: "(\w+)",/);
        return match[1];
    };

    var parseSubtitleData = function(){
        return COMMON_SOURCE.grabIplaSubtitlesData(getJson());
    };

    this.setup = function(){
        var callback = function(data) {
            window.sessionStorage.setItem(config.storage.topWindowLocation, data.location);
            WrapperDetector.run(properties);
        };
        MessageReceiver.awaitMessage({
            origin: 'https://pulsembed.eu',
            windowReference: window.parent
        }, callback);
    };
});
