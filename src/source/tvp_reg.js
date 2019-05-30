var TVP_REG = (function(TVP_REG) {
    var properties = Configurator.setup({
        wrapper: {
            selector: 'div.js-video'
        },
        button: {
            class: 'tvp_reg_download_button'
        },
        asyncSteps: [
            AsyncStep.setup({
                urlTemplate: 'https://www.tvp.pl/shared/cdn/tokenizer_v2.php?object_id=#videoId',
                beforeStep: function(input){
                    return idParser();
                },
                afterStep: function(output) {
                    return VOD_TVP.grabVideoFormats(output);
                }
            })
        ]
    });

    var idParser = function(){
        try {
            return $('div.js-video').attr('data-object-id');
        }
        catch(e){
            throw CONST.id_error;
        }
    };

    TVP_REG.waitOnWrapper = function(){
        WrapperDetector.run(properties);
    };

    return TVP_REG;
}(TVP_REG || {}));
