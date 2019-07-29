const AssociateType = Object.freeze({
  BELONGS_TO_MANY: Symbol('belongsToMany'),
  BELONGS_TO: Symbol('belongsTo'),
  HAS_MANY: Symbol('hasMany'),
  HAS_ONE: Symbol('hasOne'),
});

class SequelizeModelBuilder {
  static build(Model) {
    return (sequelize, dataTypes) => {
      const modelForm = SequelizeModelBuilder.makeDefine(new Model(dataTypes, AssociateType));

      const modelDefine = sequelize.define(Model.name, modelForm.elements, modelForm.attributes);

      const property = Object.getOwnPropertyNames(modelForm.functions);
      for (let i = 0; i < property.length; ++i) {
        if (SequelizeModelBuilder.isModelFunction(modelForm.functions[property[i]], property[i])) {
          modelDefine[property[i]] = modelForm.functions[property[i]];
        }
      }

      modelDefine.associate = function associate() {
        for (const property in modelForm.associations) {
          const target = sequelize.import(modelForm.associations[property].target);
          const { association } = modelForm.associations[property];
          const { option } = modelForm.associations[property];
          if (typeof option.through !== 'undefined') option.through = sequelize.import(option.through);

          SequelizeModelBuilder
            .getAssociateMethod(modelDefine, association)
            .call(modelDefine, target, option);
        }
      };

      return modelDefine;
    };
  }

  static makeDefine(model) {
    const modelElements = SequelizeModelBuilder.getModelElements(model);
    const modelAttributes = SequelizeModelBuilder.getModelAttributes(model);
    const modelAssociations = SequelizeModelBuilder.getModelAssociations(model);
    const modelFunctions = SequelizeModelBuilder.getModelFunctions(model);

    return {
      elements: modelElements,
      attributes: modelAttributes,
      associations: modelAssociations,
      functions: modelFunctions,
    };
  }

  static getModelElements(model) {
    const modelElements = {};

    for (const property in model) {
      if (SequelizeModelBuilder.isModelElement(model[property])) {
        modelElements[property] = model[property];
      }
    }

    return modelElements;
  }

  static isModelElement(element) {
    return !(typeof element !== 'object' || typeof element.type === 'undefined');
  }

  static getModelAttributes(model) {
    const modelAttributes = {};

    for (const property in model) {
      if (SequelizeModelBuilder.isModelAttribute(model, property)) {
        modelAttributes[property] = model[property];
      }
    }

    return modelAttributes;
  }

  static isModelAttribute(model, property) {
    return !(typeof model[property] === 'object' || property === 'name');
  }

  static getModelAssociations(model) {
    const modelAssociations = {};

    for (const property in model) {
      if (SequelizeModelBuilder.isModelAssociation(model[property])) {
        modelAssociations[property] = model[property];

        if (!modelAssociations[property].option) modelAssociations[property].option = {};

        if (!modelAssociations[property].option.as
          && !(modelAssociations[property].association === AssociateType.BELONGS_TO)) {
          modelAssociations[property].option.as = property;
        }
        if (modelAssociations[property].option.as === null) {
          modelAssociations[property].option.as = undefined;
        }

        if (!modelAssociations[property].option.foreignKey
          && modelAssociations[property].association === AssociateType.BELONGS_TO) {
          modelAssociations[property].option.foreignKey = property;
        }
        if (modelAssociations[property].option.foreignKey === null) {
          modelAssociations[property].option.foreignKey = undefined;
        }
      }
    }

    return modelAssociations;
  }

  static isModelAssociation(element) {
    return (typeof element === 'object' && typeof element.association !== 'undefined');
  }

  static getModelFunctions(model) {
    const proto = model.__proto__;

    const modelFunctions = {};

    const property = Object.getOwnPropertyNames(proto);
    for (let i = 0; i < property.length; ++i) {
      if (SequelizeModelBuilder.isModelFunction(proto[property[i]], property[i])) {
        modelFunctions[property[i]] = proto[property[i]];
      }
    }

    return modelFunctions;
  }

  static isModelFunction(element, name) {
    return typeof element === 'function' && name !== 'constructor';
  }

  static getAssociateMethod(modelDefine, association) {
    let associateMethod = () => {};

    switch (association) {
      case AssociateType.BELONGS_TO_MANY:
        associateMethod = modelDefine.belongsToMany;
        break;
      case AssociateType.BELONGS_TO:
        associateMethod = modelDefine.belongsTo;
        break;
      case AssociateType.HAS_MANY:
        associateMethod = modelDefine.hasMany;
        break;
      case AssociateType.HAS_ONE:
        associateMethod = modelDefine.hasOne;
        break;
    }

    return associateMethod;
  }
}

module.exports = { build: SequelizeModelBuilder.build };
