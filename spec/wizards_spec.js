describe("WizardStep", function() {

    var step;

    beforeEach(function() {
        step = new WizardStep({url: '/foobar'});
    });

    it("should be initializable with url option", function() {
        expect(step.url).toEqual('/foobar');
    });

    it("should load the contents of given url via", function() {
        
        spyOn($, 'ajax').andCallFake(function (req) {
            var d = $.Deferred();
            d.resolve('<p>ffffuuuuuu</p>');
            return d.promise();
        });

        var asyncCallComplete = false;

        runs(function() {
            step.load().done(function() {
                asyncCallComplete = true;
            });
        });

        waitsFor(function() {
            return false !== asyncCallComplete;
        });

        runs(function() {
            expect(step.content).toBe('<p>ffffuuuuuu</p>');
            expect($.ajax.mostRecentCall.args[0]["url"]).toEqual('/foobar');
        });

    });
});

describe("Wizard", function() {

    var wizard;

    beforeEach(function() {
        $('body').append('<div id="wizard"></div>');
        wizard = new Wizard('wizard');
    });

    it("should not have any steps by default", function() {
        expect(wizard.steps.length).toEqual(0);
    });

    it("should have default index of -1 before rendering", function() {
        expect(wizard.currentIndex).toEqual(-1);
    });

    it("should be able to add teps", function() {
        var step = new WizardStep({url: '/foobar'});
        wizard.addStep(step);
        expect(step.wizard).toEqual(wizard);
        expect(wizard.steps.length).toEqual(1);
        expect(step.id).toEqual(1);
        var step2 = new WizardStep({url: '/foobar2'});
        wizard.addStep(step2);
        expect(step2.id).toEqual(2);
        expect(wizard.steps.length).toEqual(2);
    });

    it("should render its basic skeleton template with first step", function() {        
        var step1 = new WizardStep({url: '/foobar'});

        spyOn(step1, 'load').andCallFake(function (req) {
            var d = $.Deferred();
            d.resolve();
            return d.promise();
        });

        wizard.addStep(step1);
        wizard.render();
        expect(wizard.currentStep).toEqual(step1);
        expect(wizard.$content.find('div.wizard-step').length).toEqual(1);
        expect(step1.load).toHaveBeenCalled();
    });

    it("should load next steps asynchronously by default and update current step", function() {
        var step1 = new WizardStep({url: '/foobar1'});
        var step2 = new WizardStep({url: '/foobar2'});
        var step3 = new WizardStep({url: '/foobar3'});
        wizard.addStep(step1);
        wizard.addStep(step2);
        wizard.addStep(step3);

        var step1Complete, step2Complete, step3Complete = false;

        spyOn($, 'ajax').andCallFake(function (req) {
            var d = $.Deferred();
            d.resolve('<p>ffffuuuuuubar1</p>');
            return d.promise();
        });

        runs(function() {
            wizard.render().done(function() {
                step1Complete = true;
            });
        });
        waitsFor(function() {
            return false !== step1Complete;
        });
        runs(function() {
            expect(wizard.currentStep).toEqual(step1);
            expect(wizard.isOnLastStep()).toEqual(false);
        });

        // ------ Step2 ------ //
        runs(function() {
            wizard.nextStep().done(function() {
                step2Complete = true;
            });
        });
        waitsFor(function() {
            return false !== step2Complete;
        });
        runs(function() {
            expect(wizard.currentStep).toEqual(step2);
            expect(wizard.isOnLastStep()).toEqual(false);
        });

        // ------ Step3 ------ //
        runs(function() {
            wizard.nextStep().done(function() {
                step3Complete = true;
            });
        });
        waitsFor(function() {
            return false !== step3Complete;
        });
        runs(function() {
            expect(wizard.currentStep).toEqual(step3);
            expect(wizard.isOnLastStep()).toEqual(true);
        });

    });

});