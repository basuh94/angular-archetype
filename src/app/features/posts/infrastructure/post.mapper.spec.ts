import { mapPostDtoToDomain } from './post.mapper';

describe('mapPostDtoToDomain', () => {
  it('maps DTO to domain model', () => {
    const result = mapPostDtoToDomain({
      id: 1,
      userId: 10,
      title: 'title',
      body: 'body',
    });

    expect(result).toEqual({
      id: 1,
      userId: 10,
      title: 'title',
      body: 'body',
    });
  });
});
