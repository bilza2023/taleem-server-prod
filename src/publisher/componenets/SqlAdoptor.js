export default async function sqlAdoptor(kernel, data) {
	const courseSlug = data.course.slug;

	await kernel.db.$transaction(async tx => {
		await tx.library.deleteMany({
			where: { courseSlug }
		});

		await tx.course.deleteMany({
			where: { slug: courseSlug }
		});

		await tx.course.create({
			data: {
				slug: data.course.slug,
				title: data.course.title,
				description: data.course.description,
				thumbnail: data.course.thumbnail,
				groupings: JSON.stringify(data.course.groupings || [])
			}
		});

		for (const item of data.library) {
			await tx.library.create({
				data: {
					...item,
					courseSlug,
					groupSlug: item.groupSlug
				}
			});
		}
	});

	return true;
}