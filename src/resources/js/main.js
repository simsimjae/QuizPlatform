import $ from 'jquery';
import Constants from './constant';
import './routing';
import modal from './modal';
import {mainInfinity} from './infinity';

require('./jsrender')($);


$(function () {
  window.mainInfinity = new mainInfinity();
  window.oModal = new modal();
});
