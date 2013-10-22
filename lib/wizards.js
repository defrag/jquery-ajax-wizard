/*global jQuery, window */

(function($, w) {
    "use strict";
    
    var WizardStep, Wizard;
    
    Wizard = function(elementId, options) {
        var self = this;
        this.steps = [];
        this.elementId = '#' + elementId;
        this.currentIndex = -1;
        this.options = {};
        this.currentStep = null;
        $.extend(this.options, options || {});
        var wizardTemplate = [

                '<div class="wizard">',
                    '<div class="wizard-steps-container">',
                    '</div>',
                    '<div class="wizard-navigation">',
                        '<div class="btn-group-single">',
                            '<button class="btn wizard-prev disabled" type="button">Back</button>',
                            '<button class="btn btn-primary wizard-next" type="button">Next</button>',
                        '</div>',
                    '</div>',
                    '<div class="wizard-loader" style="display:none">Loading...</div>',
                '</div>'

        ];

        this.$el = $(wizardTemplate.join("\n"));
        this.$navigation = this.$el.find(".wizard-navigation");
        this.$nextButton = this.$navigation.find(".wizard-next");
        this.$prevButton = this.$navigation.find(".wizard-prev");
        this.$loader = this.$el.find(".wizard-loader");
        this.$content = this.$el.find('.wizard-steps-container');


        var delegateEvents = function() {

            self.$nextButton.on('click', function(e) {
                e.preventDefault();
                self.nextStep();                
            });

            self.$prevButton.on('click', function(e) {
                e.preventDefault();
                if (self.$prevButton.hasClass('disabled')) {
                    return false;
                }
                self.prevStep();
            });
        };

        (function() {
            delegateEvents();
        })();
    };

    Wizard.prototype.addStep = function(step) {
        step.wizard = this;
        step.id = this.steps.length + 1;
        this.steps.push(step);
    };

    Wizard.prototype.nextStep = function() {
        var self = this;
        if (self.isOnLastStep()) {
            self.finalize();
            return;
        }
        var deffered = $.Deferred();
        self.currentStep.doValidate().done(function() {
            var step = self.steps[++self.currentIndex];
            self.loadStep(step).done(function() {
                deffered.resolve();
            });
        });
        return deffered;
    };

    Wizard.prototype.prevStep = function() {
        var self = this;
        var step = self.steps[--self.currentIndex];
        return self.loadStep(step);
    };

    Wizard.prototype.isOnLastStep = function() {
        return this.currentIndex === this.steps.length - 1;
    };

    Wizard.prototype.loadStep = function(step) {
        var self = this;
        self.$prevButton.toggleClass("disabled", self.currentIndex === 0);

        if (true === self.$content.find('#wizard-step-'+step.id).data('has-content')) {
            self.$content.find('.wizard-step').hide();
            self.$content.find('#wizard-step-'+step.id).show();
            self.currentStep = step;
            return;
        }

        self.$loader.show();
        return step.load().done(function(){
            self.$content.find('.wizard-step').hide();
            self.$content.find('#wizard-step-' + step.id)
                .html(step.content)
                .data('has-content', true)
                .show();

            self.currentStep = step;
        }).always(function() { self.$loader.hide(); });
    };

    Wizard.prototype.render = function() {
        var self = this;
        $(this.elementId).html(this.$el);

        for (var i = 0; i < self.steps.length; i++) {
            var template = '<div class="wizard-step" style="display:none;" id="wizard-step-' + self.steps[i].id + '"></div>';
            self.$content.append(template);
        }
        var step = this.steps[++this.currentIndex];
        self.currentStep = step;
        return self.loadStep(step);
    };

    Wizard.prototype.finalize = function() {
        var self = this;
        self.$content.wrap('<form id="wizard-form"></form>');
        var data = self.$el.find('#wizard-form').serialize();
        self.$content.unwrap();     
        if ($.isFunction(self.options.finalize)) {
            this.options.finalize(data);
        }
    };

    WizardStep = function(options) {
        this.url = options.url;
        this.content = '';
        this.validate = options.validate;
        this.wizard = null;
        this.id = null;
    };

    WizardStep.prototype.load = function() {
        var deferred = $.Deferred();
        var self = this;
        $.get(this.url).done(function(response){
            self.content = response;
            deferred.resolve();
        });
        return deferred.promise();
    };

    WizardStep.prototype.doValidate = function() {
        if ($.isFunction(this.validate)) {
            return this.validate(this);
        }
        return $.Deferred().resolve().promise();
    };

    w.Wizard = Wizard;
    w.WizardStep = WizardStep;

})(jQuery, window);