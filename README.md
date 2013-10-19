# jQuery ajax wizards

[![Build Status](https://travis-ci.org/defrag/jquery-ajax-wizard.png)](https://travis-ci.org/defrag/jquery-ajax-wizard)


The library aims to wrap the multi step wizards based on ajax content. 
If You dont need each new step to be loaded via ajax, please use other avilable jquery wizards
plugins. It operates on jQuery defered objects execution.

## Getting Started

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/defrag/jquery-ajax-wizard/master/dist/wizards.min.js
[max]: https://raw.github.com/defrag/jquery-ajax-wizard/master/dist/wizards.js

In your web page:

```html
<script src="dist/wizards.min.js"></script>
<div id="wizard"></div>

<script>
var wizard = new Wizard('wizard');
wizard.addStep(new WizardStep({url: '/foo'}));
wizard.addStep(new WizardStep({url: '/bar'}));
wizard.render();
</script>
```


## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## Todo
Refactor specs

## License
Copyright (c) 2013 Michal Dabrowski  
Licensed under the MIT license.
