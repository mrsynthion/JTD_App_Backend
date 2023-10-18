import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User"


const userRepository = AppDataSource.getRepository(User)

async function getAall(request: Request, response: Response, next: NextFunction) {
    return userRepository.find()
}

async function one(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id


    const user = await userRepository.findOne({
        where: {id}
    })

    if (!user) {
        return "unregistered user"
    }
    return user
}

async function save(request: Request, response: Response, next: NextFunction) {
    const {firstName, lastName, email, age}: User = request.body;

    const user = Object.assign(new User(), {
        firstName,
        lastName,
        email,
        age
    })

    return userRepository.save(user)
}

async function remove(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id

    let userToRemove = await userRepository.findOneBy({id})

    if (!userToRemove) {
        return "this user not exist"
    }

    await userRepository.remove(userToRemove)

    return "user has been removed"
}
