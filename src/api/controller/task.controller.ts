import {AppDataSource} from "../../data-source"
import {sendError} from "../../utils/error.utils";
import {Response} from "express";
import {ErrorCode} from "../../global-types/error.types";
import {Task} from "../entity/Task";
import {validateTitle} from "../../utils/task.utils";
import {User} from "../entity/User";


const taskRepository = AppDataSource.getRepository(Task)
const userRepository = AppDataSource.getRepository(User)

// async function getTaskPage({
//                                page,
//                                size,
//                                sort,
//                                id,
//                            }: Filters<Task>, res: Response<Page<Task>>): Promise<void> {
//     try {
//         const data = await AppDataSource.transaction(async (appDataSource) => {
//                 const totalElements = await appDataSource
//                     .getRepository(Task)
//                     .createQueryBuilder("user")
//                     .where("user.id like :id", {id: `%${id || ''}%`})
//                     .andWhere("user.age like :age", {age: `%${age || ''}%`})
//                     .andWhere("user.email like :email", {email: `%${email || ''}%`})
//                     .andWhere("user.firstName like :firstName", {firstName: `%${firstName || ''}%`})
//                     .andWhere("user.lastName like :lastName", {lastName: `%${lastName || ''}%`})
//                     .andWhere("user.username like :username", {username: `%${username || ''}%`})
//                     .getCount()
//
//                 const skip: number = size * (page - 1) || 0;
//                 size = (size === undefined || size === null) ? totalElements : size;
//                 const sortBy: SortBy<User> = sort?.[0] ? sort[0] : 'id';
//                 const sortDirection: SortDirection = sort?.[1] ? sort[1] : 'ASC'
//
//                 const content = await appDataSource
//                     .getRepository(User)
//                     .createQueryBuilder("user")
//                     .select(['user.id', 'user.firstName', 'user.lastName', 'user.age', 'user.email', 'user.username'])
//                     .skip(skip)
//                     .take(size)
//                     .where("user.id like :id", {id: `%${id || ''}%`})
//                     .andWhere("user.age like :age", {age: `%${age || ''}%`})
//                     .andWhere("user.email like :email", {email: `%${email || ''}%`})
//                     .andWhere("user.firstName like :firstName", {firstName: `%${firstName || ''}%`})
//                     .andWhere("user.lastName like :lastName", {lastName: `%${lastName || ''}%`})
//                     .andWhere("user.username like :username", {username: `%${username || ''}%`})
//                     .addOrderBy(sortBy, sortDirection)
//                     .getMany()
//
//                 return {
//                     content,
//                     totalElements,
//                     totalPages: Math.floor((totalElements / size) || 0),
//                     numberOfElements: content.length
//                 } as Page<User>
//             }
//         )
//         res.statusCode = 200;
//         res.json(data);
//     } catch ({message}) {
//         sendError(400, message, res)
//     }
// }

async function getCertainTask(id: string, res: Response): Promise<void> {
    try {
        const task: Task = await taskRepository.findOne({
            where: {
                id
            }
        })
        res.statusCode = 200;
        res.json(task);
    } catch ({message}) {
        sendError(400, message, res)
    }

}

async function addTask(task: Task, res: Response<Task>): Promise<void> {
    try {
        console.log(task)
        if (task.title) validateTitle(task.title)
        const id = '59287d03-fc6e-4df8-acf9-9343933e5d25'
        const user: User = await userRepository.findOneBy({id})
        //  const newTask: Task = await taskRepository.save(task);
        res.statusCode = 200;
        res.json(task)
    } catch ({message}) {
        let newMessage: ErrorCode = message;
        sendError(400, newMessage, res)
    }
}

async function editCertainTask(id: string, task: Task, res: Response<Task>): Promise<void> {
    try {
        delete task['id']
        if (task.title) validateTitle(task.title)
        await taskRepository.save(task);
        const newTask: Task = await taskRepository.findOneBy({id});
        res.statusCode = 200;
        res.json(newTask)
    } catch ({message}) {
        let newMessage: ErrorCode = message;
        sendError(400, newMessage, res)
    }
}

export const TaskControllerFunctions = {
    getCertainTask,
    addTask,
    editCertainTask
}