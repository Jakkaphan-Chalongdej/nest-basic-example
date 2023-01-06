export enum DB_TABLE {
  USER = 'user',
  BOOK = 'book',
  HISTORY = 'history',
  ORDER = 'order',
  PRODUCT = 'product',
  ORDER_ITEM = 'order_item',
}

export enum ENUMBaseEntity {
  ID = 'id',
}

export enum ENUMCommonEntity {
  CREATED_AT = 'created_at',
  DELETED_AT = 'deleted_at',
  IS_DELETE = 'is_delete',
  UPDATED_AT = 'updated_at',
}

export enum ENUMTypeColumnEntity {
  TYPE_ID = 'int4',
  TYPE_DATE = 'int8',
  TYPE_TIMESTAMP = 'timestamp',
}
