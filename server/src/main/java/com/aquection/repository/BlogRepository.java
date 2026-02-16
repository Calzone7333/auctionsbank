package com.aquection.repository;

import com.aquection.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByIsFeaturedTrue();

    List<Blog> findByCategory(String category);
}
