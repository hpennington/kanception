import UserRepositoryInterface from '../user-repository-interface'
import User from '../../models/user'

class UserRepository implements UserRepositoryInterface {
  async findBySub(sub: string): Promise<User> {
    return {
      sub: sub,
      _id: '0f0d514cf6a4dbf1f5d74b7152f440d0',
      email: '',
  	  name: {
  	    first: '',
  	    last: '',
  	  },
  	  spaces: [],
  	  active: true,
    }
  }
    async findOne(criteria): Promise<User> {
    return criteria
  }
}

export default UserRepository