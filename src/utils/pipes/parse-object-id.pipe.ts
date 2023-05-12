import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

/**
 * Defines the pipe for MongoDB ObjectID validation and transformation
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  /**
   * Validates and transforms a value to a MongoDB ObjectID
   *
   * @remarks
   * Throws a BadRequestException if the validation fails
   *
   * @param value - The value to validate and transform
   * @returns The MongoDB ObjectID
   */
  public transform(value: any): ObjectId {
    try {
      const transformedObjectId: ObjectId = ObjectId.createFromHexString(value);
      return transformedObjectId;
    } catch (error) {
      throw new BadRequestException('Validation failed (ObjectId is expected)');
    }
  }
}
