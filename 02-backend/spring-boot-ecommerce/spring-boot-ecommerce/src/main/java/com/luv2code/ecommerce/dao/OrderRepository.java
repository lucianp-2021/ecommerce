package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource
@PreAuthorize("principal.subject == #email")
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page <Order> findByCustomerEmailOrderByDateCreatedDesc(@Param(value = "email") String email, Pageable pageable);

    // Custom query methods can be defined here if needed
    // For example, to find orders by customer ID:
    // List<Order> findByCustomerId(Long customerId);

    // Or to find orders by status:
    // List<Order> findByStatus(String status);
}
