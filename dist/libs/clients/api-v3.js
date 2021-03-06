'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _apiV = require('./api-v2');

var _apiV2 = _interopRequireDefault(_apiV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef {Object} Link
 * @description Описывает связь между двумя сущностями
 * @property {String} from - Сущность у которой необходимо
 * получить связи (leads, contacts, companies, customers, catalog_elements)
 * @property {Number} from_id - ID элемента сущности
 * @property {String} to - Сущность, которая привязана
 * (leads, contacts, companies, customers, catalog_elements)
 * @property {Number} to_id - ID элемента сущности которая привязана
 * @property {Number} [from_catalog_id] - ID каталога,
 * связи с которым необходимо получить
 * @property {Number} [to_catalog_id] - ID каталога,
 * элементы которого привязаны к сущности
 * @property {Number} [quantity] - Колличество привязанных элементов
 */

/**
 * @typedef {Object} Customer
 * @description Аналогичен сущности "сделка".
 * Состоит из предустановленного набора полей и дополнительных,
 * создаваемых администратором аккаунта.
 * Каждый покупатель может быть прикреплен
 * к одному и более контакту или не
 * прикреплен ни к одному.
 * Каждому покупателю может быть задан
 * ответственный для разграничения прав
 * доступа между сотрудниками аккаунта.
 * Покупатель обладает периодом, который
 * обозначает положение покупателя в жизненном
 * цикле (бизнес-процесс).
 * Список периодов может быть изменен
 * в рамках аккаунта, кроме первого и
 * трех конечных системных периодов.
 * @property {Number} id - Уникальный идентификатор элемента
 * @property {String} name - Название элемента
 * @property {Number} date_create - Дата создания (timestamp)
 * @property {Number} date_modify - Дата изменения (timestamp)
 * @property {Number} created_by - ID пользователя, создавшего покупателя
 * @property {Number} modified_by - ID пользователя, изменившего покупателя
 * @property {Number} main_user_id - ID пользователя,
 * ответственного за покупателя
 * @property {Number} account_id - Уникальный идентификатор аккаунта
 * @property {Number} next_price - Ожидаемая сумма покупки
 * @property {Number} periodicity - Периодичность
 * @property {Number} next_date - Дата след. покупки
 * @property {Array} tags - Массив тегов
 * @property {Number} main_contact_id - ID основного контакта
 * или false, в случае его отсутствия
 * @property {String} period_id - Уникальный идентификатор периода
 * @property {Array} custom_fields - Массив полей элемента,
 * если они есть, иначе пустой массив
 */

/**
 * @typedef {Object} Transaction
 * @description Транзакция - это сущность которая описывает
 * основные характеристики покупки (дата и сумма).
 * Является дополнением для "покупателя".
 * @property {Number} id - Уникальный идентификатор элемента
 * @property {Number} account_id - Уникальный идентификатор аккаунта
 * @property {Number} customer_id - Уникальный идентификатор покупателя
 * @property {Number} created_by - ID пользователя, создавшего покупателя
 * @property {Number} modified_by - ID пользователя, изменившего покупателя
 * @property {Number} date - Дата совершенной покупки (timestamp)
 * @property {Number} price - Сумма покупки
 * @property {Number} deleted - свойство корзины
 * @property {Number} date_create - Дата создания (timestamp)
 * @property {Number} date_modify - Дата изменения (timestamp)
 */

/**
 * @classdesc Client for api v3 of amoCRM
 * @extends AmoV2ApiClient
 */
var AmoV3ApiClient = function (_AmoV2ApiClient) {
  _inherits(AmoV3ApiClient, _AmoV2ApiClient);

  /**
   * @param {RequesterClass} request
   * @param {PromoClientClass} promoClient
   */
  function AmoV3ApiClient(request, promoClient) {
    _classCallCheck(this, AmoV3ApiClient);

    var _this = _possibleConstructorReturn(this, (AmoV3ApiClient.__proto__ || Object.getPrototypeOf(AmoV3ApiClient)).call(this, request, promoClient));

    var v3Elements = {
      customers: 'Customers',
      transactions: 'Transactions',
      catalogs: 'Catalogs',
      catalog_elements: 'CatalogElements'
    };
    var elementsPaths = {};

    _underscore2.default.each(v3Elements, function (entityCamel, entity) {
      var pagination = entity !== 'catalogs';
      elementsPaths[entity + '/list'] = 'api/v2/' + entity + '/';
      elementsPaths[entity + '/set'] = 'api/v2/' + entity + '/';

      _this['list' + entityCamel] = _this._buildListMethod(entity, pagination);
      _this['set' + entityCamel] = _this._buildSetMethod(entity);
      _this['add' + entityCamel] = _this._buildAddMethod(entity, true);
      _this['update' + entityCamel] = _this._buildUpdateMethod(entity, true);
      _this['delete' + entityCamel] = _this._buildDeleteMethod(entity, true);
    }, _this);

    elementsPaths['links/list'] = 'api/v2/links/';
    elementsPaths['links/set'] = 'api/v2/links/';
    _this.setLinks = _this._buildSetMethod('links');
    _this.linkLinks = _this._buildActionMethod('link', 'links', true);
    _this.unlinkLinks = _this._buildActionMethod('unlink', 'links', true);

    // noinspection JSAccessibilityCheck
    _underscore2.default.extend(_this._pathMatch, elementsPaths);
    return _this;
  }

  /**
   * @description Get list of links
   * @memberOf AmoV3ApiClient
   * @instance
   * @public
   * @param {Array.<Link>} links
   * @return {Promise}
   */


  _createClass(AmoV3ApiClient, [{
    key: 'listLinks',
    value: function listLinks(links) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2._get('links/list', { links: links }).then(function (res) {
          if (!res.links) {
            return reject(res);
          }

          return resolve(res.links);
        }, reject);
      });
    }

    /**
     * @description Add|update links
     * @method linkLinks
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Link>} links - Массив связей между сущностями.
     * для обновления связи передавать её id нет необходимости.
     * @return {Promise}
     */

    /**
     * @description Remove links
     * @method unlinkLinks
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Link>} links - Массив связей,
     * которые необходимо разорвать
     * @return {Promise}
     */

    /**
     * @description Execute set method of links
     * @method setLinks
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} data
     * @param {Array.<Link>} [data.link] - Массив связей между сущностями.
     * для обновления связи передавать её id нет необходимости.
     * @param {Array.<Link>} [data.unlink] - Массив связей,
     * которые необходимо разорвать
     * @param {Object} [qs]
     * @return {Promise}
     */

    /**
     * @description Get list of customers
     * @method listCustomers
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} [qs]
     * @param {Number} [qs.limit_rows] - Количество
     * выбираемых строк (системное ограничение 500)
     * @param {Number} [qs.limit_offset] - Оффсет выборки
     * (Работает, только при условии, что limit_rows тоже указан)
     * @param {Number} [qs.filter.id] - Выбрать элемент
     * с заданным ID (нужно передавать массив идентификаторов)
     * @param {Object|Number} [qs.filter.date] - Выбрать элемент
     * по дате создания или редактирования
     * @param {String} [qs.filter.date.type] - Тип даты:
     * create или modify
     * @param {Number} [qs.filter.date.from] - Дата
     * с которой нужно начинать выборку (timestamp)
     * @param {Number} [qs.filter.date.to] - Дата до которой нужно выбирать
     * (timestamp)
     * @param {Object|Number} [qs.filter.next_date] - Выбрать элемент по дате
     * следующей покупки (нужно передавать массив с параметрами from, to)
     * @param {Number} [qs.filter.next_date.from] - Аналогично filter.date.from
     * @param {Number} [qs.filter.next_date.to] - Аналогично filter.date.to
     * @param {Number|Array.<Number>} [qs.filter.main_user] - Выбрать элемент
     * по ответственному пользователю
     * @param {boolean} [withPagination] - если true, то
     * результат будет выглядеть
     * {customers: Array, pagination: {current: Number, total: Number}.
     * Если false - результатом будет массив покупателей
     * @return {Promise}
     */

    /**
     * @description Add customers
     * @method addCustomers
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Customer>} customers - Массив покупателей,
     * которых необходимо создать
     * @return {Promise}
     */

    /**
     * @description Update customers
     * @method updateCustomers
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Customer>} customers - Массив покупателей,
     * которых необходимо изменить
     * @return {Promise}
     */

    /**
     * @description Execute set method of customers
     * @method setCustomers
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} data
     * @param {Array.<Customer>} [data.add] - См. addCustomers
     * @param {Array.<Customer>} [data.update] - См. updateCustomers
     * @param {Object} [qs]
     * @return {Promise}
     */

    /**
     * @description Execute delete method of customers
     * @method deleteCustomers
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Number>} ids - ID покупателей, которых необходимо удалить
     * @return {Promise}
     */

    /**
     * @description Get list of transactions
     * @method listTransactions
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} [qs]
     * @param {Number} [qs.limit_rows] - Количество
     * выбираемых строк (системное ограничение 500)
     * @param {Number} [qs.limit_offset] - Оффсет выборки
     * (Работает, только при условии, что limit_rows тоже указан)
     * @param {Number} [qs.filter.id] - Выбрать элемент
     * с заданным ID (нужно передавать массив идентификаторов)
     * @param {Number|Array.<Number>} [qs.customer_id] - Выбрать транзакции
     * конкретных покупателей
     * @param {boolean} [withPagination]
     * @return {Promise}
     */

    /**
     * @description Add transactions
     * @method addTransactions
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Transaction>} transactions
     * @return {Promise}
     */

    /**
     * @description Update transactions
     * @method updateTransactions
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Transaction>} transactions
     * @return {Promise}
     */

    /**
     * @description Execute set method of transactions
     * @method setTransactions
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} data
     * @param {Array.<Transaction>} [data.add] - См. addTransactions
     * @param {Array.<Transaction>} [data.update] - См. updateTransactions
     * @param {Object} [qs]
     * @return {Promise}
     */

    /**
     * @description Execute delete method of transactions
     * @method deleteTransactions
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Number>} ids
     * @param {boolean} [keepErrorsInResponse] - если true, то
     * результат будет выглядеть {errors: Array, transactions: Array}.
     * Если false - результатом будет массив
     * мета-информации удалённых транзакций
     * @return {Promise}
     */

    /**
     * @description Get list of catalogs
     * @method listCatalogs
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} [qs]
     * @return {Promise}
     */

    /**
     * @description Add catalogs
     * @method addCatalogs
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array} catalogs
     * @return {Promise}
     */

    /**
     * @description Update catalogs
     * @method updateCatalogs
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array} catalogs
     * @return {Promise}
     */

    /**
     * @description Execute set method of catalogs
     * @method setCatalogs
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} data
     * @param {Array} [data.add]
     * @param {Array} [data.update]
     * @param {Object} [qs]
     * @return {Promise}
     */

    /**
     * @description Execute delete method of catalogs
     * @method deleteCatalogs
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Number>} ids
     * @return {Promise}
     */

    /**
     * @description Get list of catalog elements
     * @method listCatalogElements
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} [qs]
     * @param {boolean} [withPagination]
     * @return {Promise}
     */

    /**
     * @description Add catalog elements
     * @method addCatalogElements
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array} catalog elements
     * @return {Promise}
     */

    /**
     * @description Update catalog elements
     * @method updateCatalogElements
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array} catalog elements
     * @return {Promise}
     */

    /**
     * @description Execute set method of catalog elements
     * @method setCatalogElements
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Object} data
     * @param {Array} [data.add]
     * @param {Array} [data.update]
     * @param {Object} [qs]
     * @return {Promise}
     */

    /**
     * @description Execute delete method of catalog elements
     * @method deleteCatalogElements
     * @memberOf AmoV3ApiClient
     * @instance
     * @public
     * @param {Array.<Number>} ids
     * @return {Promise}
     */

    /**
     * @param {string} entity
     * @return {function(*)}
     * @protected
     * @instance
     * @memberOf AmoV3ApiClient
     */

  }, {
    key: '_buildDeleteMethod',
    value: function _buildDeleteMethod(entity) {
      return this._buildActionMethod('add', entity);
    }
  }]);

  return AmoV3ApiClient;
}(_apiV2.default);

exports.default = AmoV3ApiClient;