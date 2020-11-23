import { NowRequest, NowResponse } from '@vercel/node'

import {
  readProfile,
  updateProfile,
  deleteProfile,
} from '../../_lib/data/profile'
import {
  genericApiMethodHandler,
  errorHandler,
  authorizeRequest,
  getQueryParamValue,
} from '../../_lib/tools'
import { authenticateClientAppRequest } from '../../_lib/app/auth'
import { patchProfilePayloadValidator } from '../../_lib/validators'
import { IProfile, IPatchProfilePayload } from '../../_lib/types'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'GET', route: 'profile/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileId: string
  try {
    profileId = getQueryParamValue(request, 'profile_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await readProfile(profileId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function PATCH(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'PATCH', route: 'profile/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileId: string
  try {
    profileId = getQueryParamValue(request, 'profile_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let payload: IPatchProfilePayload
  try {
    payload = await patchProfilePayloadValidator(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await updateProfile(profileId, payload)
  } catch (err) {
    return errorHandler(response, err)
  }

  let result: IProfile
  try {
    result = await readProfile(profileId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(result)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  let requester: IProfile
  try {
    requester = await authenticateClientAppRequest(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await authorizeRequest(requester.role, { method: 'DELETE', route: 'profile/{id}' })
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileId: string
  try {
    profileId = getQueryParamValue(request, 'profile_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteProfile(profileId)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ deleted: 1 })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PATCH, DELETE })
}
