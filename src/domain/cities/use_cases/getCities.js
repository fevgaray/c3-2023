import citiesRepository from '../repository/worldCitiesRespository'

exports.getAllCitiesUseCase = (ctx) => {
    ctx.body = citiesRepository.getAllCitiesRepository()
    return ctx
}

exports.getCitiesByCountryUseCase = (ctx) => {
    if(hasNumber(ctx.params.country)){
        ctx.body = {"message" :"Solo se aceptan caracteres no numéricos"}
        ctx.status = 400
        return ctx
    }
    ctx.body = citiesRepository.searchCitiesByCountryName(ctx.params.country)
    if(ctx.body.length == 0){
        ctx.body = {"message" :"No se encontraron ciudades para el país ingresado"}
    }   
    return ctx
}

exports.getCitiesByCityNameAndCountryUseCase = (ctx) => {
    ctx.body = citiesRepository.searchCityByCityNameAndCountry(ctx.params.city, ctx.params.country)
    return ctx
}

function hasNumber(myString) {
    return /\d/.test(myString);
  } //True if it has number