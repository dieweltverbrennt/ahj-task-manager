import Dom from './dom';
import Widget from './widget';
import State from './state';

const dom = new Dom();
const state = new State(localStorage);
const widget = new Widget(dom, state);
widget.init();
