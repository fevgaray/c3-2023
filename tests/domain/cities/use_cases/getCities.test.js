import request from 'supertest'
import { server, app } from '../../../../src/index'
import sinon from 'sinon'
import citiesRepository from '../../../../src/domain/cities/repository/worldCitiesRespository'


function getMockCities() {
    return [
        {"country": "Andorra", 
        "geonameid": 3040051, 
        "name": "les Escaldes", 
        "subcountry": "Escaldes-Engordany"
        },
        {"country": "United Arab Emirates", 
        "geonameid": 291696, 
        "name": "Khawr Fakk\u0101n", 
        "subcountry": "Ash Sh\u0101riqah"
        },
        {"country": "Chile", 
        "geonameid": 291696, 
        "name": "Santiago", 
        "subcountry": "Ash Sh\u0101riqah"
        }
    ]
}

function mockMessage1(){
    return{"message":"No se encontraron ciudades para el país ingresado"}
}

function mockMessage2(){
    return{"message":"Solo se aceptan caracteres no numéricos"}
}

describe('GET /api/users', () => {
    beforeEach(() => {
        sinon.restore()
    })

    afterAll(() => {
        server.close()
    })

    test('should respond with ALL the cities', async () => {
        sinon.stub(citiesRepository, 'getAllCitiesRepository').returns(getMockCities())
        const response = await request(app.callback()).get('/api/cities')
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(3)
        expect(response.body).toEqual(getMockCities())
    })

    test('should return response with status 200 and body with succesful search results, cities searched by country', async () => {
        sinon.stub(citiesRepository, 'searchCitiesByCountryName').returns([getMockCities()[0]])
        const response = await request(app.callback()).get('/api/cities/by_country/and')
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body).toEqual([getMockCities()[0]])
    })

    test('should return response with status 200 and body with a message indicating no cities were found, when input is a string', async () => {
        const spySearch = sinon.spy(citiesRepository, 'searchCitiesByCountryName')
        const response = await request(app.callback()).get('/api/cities/by_country/asdadsad')
        expect(response.status).toBe(200)
        expect(spySearch.called).toBe(true)
        expect(spySearch.args[0][0]).toEqual('asdadsad')
        expect(response.body).toEqual(mockMessage1())
    })

    test('should return response with status 400 and body with a message indicating error because of using number to search', async () => {
        const spySearch = sinon.spy(citiesRepository, 'searchCitiesByCountryName')
        const response = await request(app.callback()).get('/api/cities/by_country/12345')
        expect(response.status).toBe(400)
        expect(spySearch.called).toBe(false)
        expect(response.body).toEqual(mockMessage2())
    })

    test('should return response with status 200 and body with succesful search results, when input is a city and a country', async () => {
        //sinon.stub(citiesRepository, 'searchCityByCityNameAndCountry').returns(getMockCities()[2])
        const searchSpy = sinon.spy(citiesRepository, 'searchCityByCityNameAndCountry')
        const response = await request(app.callback()).get('/api/city/les escaldes/country/andorra')
        expect(response.status).toBe(200)
        expect(searchSpy.called).toBe(true)
        expect(response.body).toEqual([getMockCities()[0]])
    })


})